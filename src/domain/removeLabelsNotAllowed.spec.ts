import { expect, describe, test } from 'bun:test';
import { removeLabelsNotAllowed } from './removeLabelsNotAllowed';

describe('removeLabelsNotAllowed function', () => {
  test('should return the same labels if labels-not-allowed is not set', () => {
    const labels = ['Label1', 'Label2', 'Label3'];
    const result = removeLabelsNotAllowed(labels, []);
    expect(result).toEqual(labels);
  });
  
  test('should remove labels that are not allowed', () => {
    const labels = ['Label1', 'Label2', 'Label3'];
    const result = removeLabelsNotAllowed(labels, ['Label2']);
    expect(result).toEqual(['Label1', 'Label3']);
  });

  test('should handle case-insensitive labels', () => {
    const labels = ['label1', 'Label2', 'label3'];
    const result = removeLabelsNotAllowed(labels, ['LABEL1']);
    expect(result).toEqual(['Label2', 'label3']);
  });
});