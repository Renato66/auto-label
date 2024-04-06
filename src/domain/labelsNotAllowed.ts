import * as core from "@actions/core";
export const removeLabelsNotAllowed = (labels: string[]): string[] => {
  const labelsNotAllowed = core.getInput("labels-not-allowed");
  if (!labelsNotAllowed) {
    return labels;
  }
  const labelsToIgnore = JSON.parse(core.getInput("labels-not-allowed"));
  return labels.filter((elem: string) => {
    return (
      labelsToIgnore.find((label: string) => {
        return label.toLowerCase() === elem.toLowerCase();
      }) === undefined
    );
  });
};