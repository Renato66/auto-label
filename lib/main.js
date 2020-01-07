"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require('@actions/core');
const github = require('@actions/github');
const { getIssueLabels } = require('./functions');
const { getRepoLabels, addLabels } = require('./github');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = core.getInput('repo-token', { required: true });
            const ignoreComments = core.getInput('ignore-comments');
            const labelsNotAllowed = core.getInput('labels-not-allowed').split('|').filter(elem => elem !== "");
            const client = new github.GitHub(token);
            const issue = github.context.payload.issue;
            console.log('Getting repository labels...');
            const repoLabels = yield getRepoLabels(client, labelsNotAllowed);
            console.log(`Repository labels found: ${repoLabels.length}`);
            console.log('Reading labels in issue...');
            const issueLabels = getIssueLabels(issue.body, repoLabels, ignoreComments);
            console.log(`Labels found: ${issueLabels.length}`);
            if (issueLabels.length !== 0) {
                console.log('Adding labels to issue...');
                yield addLabels(client, issue.number, issueLabels);
                console.log('Done');
            }
            else {
                console.log('Done');
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
