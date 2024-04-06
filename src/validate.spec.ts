import { expect, describe, test, mock, jest } from 'bun:test';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { validate } from './validate';

// Mock core.getInput to return a token value
mock.module('@actions/core', () => ({
  getInput: jest.fn(() => 'mocked-token'),
}));

// Mock github.context.payload.issue
mock.module('@actions/github', () => ({
  context: {
    payload: {
      issue: {
        body: 'mocked issue body',
      },
    },
  },
}));

describe('validate function', () => {
  test('should not throw an error if token and issue body are defined', () => {
    // Call the validate function and expect it not to throw an error
    expect(validate).not.toThrowError();
  });

  test('should throw an error if token is not defined', () => {
    // Mock core.getInput to return an empty string
    (core.getInput as jest.Mock).mockReturnValueOnce('');

    // Call the validate function and expect it to throw an error
    expect(validate).toThrowError('No token set');
  });

  test('should throw an error if issue is undefined', () => {
    // Mock github.context.payload.issue to be undefined
    (github.context.payload.issue as any) = undefined;

    // Call the validate function and expect it to throw an error
    expect(validate).toThrowError('Issue undefined');
  });

  test('should throw an error if issue body is undefined', () => {
    // Mock github.context.payload.issue.body to be undefined
    (github.context.payload.issue as any) = {};

    // Call the validate function and expect it to throw an error
    expect(validate).toThrowError('Issue body undefined');
  });
});