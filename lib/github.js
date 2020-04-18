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
const functions_1 = require("./functions");
const github = __importStar(require("@actions/github"));
const getRepoLabels = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const labelsNotAllowed = functions_1.getLabelsNotAllowed();
    let list = [];
    let page = 1;
    let hasMorePages = false;
    do {
        const { data: labelList } = yield client.issues.listLabelsForRepo({
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            per_page: 100,
            page: page
        });
        list = [...list, ...labelList];
        hasMorePages = labelList.length === 100;
        page++;
    } while (hasMorePages);
    return list
        .map((elem) => {
        return elem.name;
    })
        .filter((elem) => {
        return (labelsNotAllowed.find((label) => {
            return label.toLowerCase() === elem.toLowerCase();
        }) === undefined);
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
