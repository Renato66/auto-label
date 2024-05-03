import { expect, describe, test } from 'bun:test';
import { getIssueLabels } from './text';

describe('getIssueLabels function', () => {
  test('should return an array of labels extracted from body', () => {
    const body = 'Body with labels <!-- AUTO-LABEL:START --> Label1 Label2 <!-- AUTO-LABEL:END -->';
    const labels = ['Label1', 'Label2'];
    const ignoreComments = true;
    const defaultLabels = ['DefaultLabel1', 'DefaultLabel2'];
    const labelsSynonyms = { 'Label1': ['Synonym1'], 'Label2': ['Synonym2'] };

    const result = getIssueLabels(body, labels, ignoreComments, defaultLabels, labelsSynonyms);

    expect(result).toEqual(['Synonym1', 'Synonym2', 'DefaultLabel1', 'DefaultLabel2']);
  });

  test('should handle no labels in body', () => {
    const body = 'No labels in this body';
    const labels = ['Label1', 'Label2'];
    const ignoreComments = true;
    const defaultLabels = ['DefaultLabel1', 'DefaultLabel2'];
    const labelsSynonyms = { 'Label1': ['Synonym1'], 'Label2': ['Synonym2'] };

    const result = getIssueLabels(body, labels, ignoreComments, defaultLabels, labelsSynonyms);

    expect(result).toEqual(['DefaultLabel1', 'DefaultLabel2']);
  });

  test('should return an array of labels extracted from body without ignoring comments', () => {
    const body = 'Body with labels <!-- AUTO-LABEL:START --> Label1 Label2 <!-- AUTO-LABEL:END -->';
    const labels = ['Label1', 'Label2'];
    const ignoreComments = false;
    const defaultLabels = ['DefaultLabel1', 'DefaultLabel2'];
    const labelsSynonyms = { 'Label1': ['Synonym1'], 'Label2': ['Synonym2'] };

    const result = getIssueLabels(body, labels, ignoreComments, defaultLabels, labelsSynonyms);

    expect(result).toEqual(['Synonym1', 'Synonym2', 'DefaultLabel1', 'DefaultLabel2']);
  });
});
