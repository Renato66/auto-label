"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
const compareLabels = (labels) => {
    const labelsSynonyms = getLabelsSynonyms();
    const hasSynonyms = Object.keys(labelsSynonyms).length !== 0;
    if (hasSynonyms) {
        const labelsRegex = new RegExp(labels
            .map(elem => {
            if (labelsSynonyms[elem] === undefined) {
                return `\\b${escapeRegExp(elem)}\\b`;
            }
            else {
                return [elem, ...labelsSynonyms[elem]]
                    .map(synonym => `\\b${escapeRegExp(synonym)}\\b`)
                    .join('|');
            }
        })
            .join('|'), 'gi');
        let synonymsObject = {};
        for (let label in labelsSynonyms) {
            labelsSynonyms[label].forEach(synonym => {
                synonymsObject[synonym] = label;
            });
        }
        const hasLabels = (line) => {
            const selectedLabels = line.match(labelsRegex) || [];
            return selectedLabels.map(elem => {
                return (synonymsObject[elem] ||
                    labels.find(label => label.toLowerCase() === elem.toLowerCase()) ||
                    elem);
            });
        };
        return hasLabels;
    }
    else {
        const labelsRegex = new RegExp(labels.map(elem => `\\b${escapeRegExp(elem)}\\b`).join('|'), 'gi');
        const hasLabels = (line) => {
            const selectedLabels = line.match(labelsRegex) || [];
            return selectedLabels.map(elem => {
                return (labels.find(label => label.toLowerCase() === elem.toLowerCase()) ||
                    elem);
            });
        };
        return hasLabels;
    }
};
exports.compareLabels = compareLabels;
const getIssueLabels = (body, labels) => {
    let selectedLabels = [];
    let hasLabels = compareLabels(labels);
    const ignoreComments = getIgnoreComments();
    if (ignoreComments) {
        const noCommentaryBody = body.replace(/\<!--(.|\n)*?-->/g, '');
        hasLabels(noCommentaryBody).map(elem => {
            selectedLabels.push(elem);
        });
    }
    else {
        hasLabels(body).map(elem => {
            selectedLabels.push(elem);
        });
    }
    const defaultLabels = getDefaultLabels();
    return [...new Set([...selectedLabels, ...defaultLabels])];
};
exports.getIssueLabels = getIssueLabels;
const getLabelsNotAllowed = () => {
    return core.getInput('labels-not-allowed')
        ? JSON.parse(core.getInput('labels-not-allowed'))
        : [];
};
exports.getLabelsNotAllowed = getLabelsNotAllowed;
const getLabelsSynonyms = () => {
    return core.getInput('labels-synonyms')
        ? JSON.parse(core.getInput('labels-synonyms'))
        : {};
};
exports.getLabelsSynonyms = getLabelsSynonyms;
const getIgnoreComments = () => {
    return core.getInput('ignore-comments')
        ? core.getInput('ignore-comments') === 'true'
        : true;
};
exports.getIgnoreComments = getIgnoreComments;
const getDefaultLabels = () => {
    return core.getInput('default-labels')
        ? JSON.parse(core.getInput('default-labels'))
        : [];
};
exports.getDefaultLabels = getDefaultLabels;
