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
const github = require('@actions/github');
const getRepoLabels = (client, labelsNotAllowed = []) => __awaiter(void 0, void 0, void 0, function* () {
    const { data: list } = yield client.issues.listLabelsForRepo({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo
    });
    return list.map((elem) => {
        return elem.name;
    }).filter((elem) => {
        return labelsNotAllowed.find((label) => {
            return label.toLowerCase() === elem.toLowerCase();
        }) === undefined;
    });
});
exports.getRepoLabels = getRepoLabels;
const addLabels = (client, issueNumber, labels) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: issueNumber,
        labels: labels
    });
});
exports.addLabels = addLabels;
