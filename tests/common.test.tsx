import React from "react";
import "jest-canvas-mock";
import renderer from "react-test-renderer";
import { verify } from "../src";
import fetchmock from "jest-fetch-mock";
fetchmock.dontMock();
describe("Common render", () => {
  it("should render correctly without crash", () => {
    const tree = renderer.create(<verify />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
