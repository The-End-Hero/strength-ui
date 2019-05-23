import React from "react";
import assert from "power-assert";
import { render, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import Amap from "../index";

describe("<Amap/>", () => {
  it("should render a <Amap/> components", () => {
    const wrapper = render(
      <div>
      </div>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
