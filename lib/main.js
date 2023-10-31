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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const functions_1 = require("./functions");
const { getRepoLabels, addLabels } = require('./github');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('*** running renato66/auto-label version 2.3.1 ***');
            const token = core.getInput('repo-token', { required: true });
            const client = new github.GitHub(token);
            const issue = github.context.payload.issue;
            if (issue === undefined) {
                console.log('Issue undefined');
                return;
            }
            if (!issue.body) {
                console.log('Issue body undefined');
                return;
            }
            console.log('Getting repository labels...');
            const repoLabels = yield getRepoLabels(client);
            console.log(`Repository labels found: ${repoLabels.length}`);
            console.log('Reading labels in issue...');
            const issueLabels = functions_1.getIssueLabels(issue.body, repoLabels);
            console.log(`Labels found: ${issueLabels.length}`);
            if (issueLabels.length !== 0) {
                console.log('Adding labels to issue...');
                yield addLabels(client, issue.number, issueLabels);
            }
            console.log('Done');
        }
        catch (error) {
            core.setFailed(error.message);
            throw error;
        }
    });
}
exports.run = run;
run();
