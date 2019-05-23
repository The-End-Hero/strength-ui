import React from "react";
import assert from "power-assert";
import { render, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import MapTalks from "../index";

describe("<Amap/>", () => {
  it("should render a <MapTalks/> components", () => {
    const wrapper = render(
      <div>
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
