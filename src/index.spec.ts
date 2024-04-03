import { describe, test, mock, afterEach } from "bun:test";
import { run } from './index'

afterEach(() => {
  mock.restore()
});

describe("Testing action functionalities", () => {
  test("should call each step", () => {
    mock.module("./validate.ts", () => ({
      validate: () => undefined
    }));
    run()
  });
});