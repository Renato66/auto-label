"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compareLabels = (labels) => {
    const labelsRegex = new RegExp(labels.map(elem => `\\b${elem}\\b`).join('|'), 'gi');
    const hasLabels = (line) => {
        const selectedLabels = line.match(labelsRegex) || [];
        return selectedLabels.map(elem => {
            return labels.find(label => label.toLowerCase() === elem.toLowerCase()) || elem;
        });
    };
    return hasLabels;
};
exports.compareLabels = compareLabels;
const getIssueLabels = (body, labels, ignoreComments) => {
    let selectedLabels = [];
    let hasLabels = compareLabels(labels);
    if (ignoreComments) {
        let comentary = false;
        body.split('\n').forEach((line) => {
            if (line.includes('<!--')) {
                comentary = true;
            }
            if (line.includes('-->')) {
                comentary = false;
            }
            if (!comentary) {
                hasLabels(line).map(elem => {
                    selectedLabels.push(elem);
                });
            }
        });
    }
    else {
        hasLabels(body).map(elem => {
            selectedLabels.push(elem);
        });
    }
    return [...new Set(selectedLabels)];
};
exports.getIssueLabels = getIssueLabels;
