import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/checkbox/styles.less";
import "../components/slider/styles.less";
import Button from "../components/button/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";
import SliderPage from "./pages/slider";

storiesOf("组件", module)
  .add(
    "slider 滑动条",
    () => (
      <div className="modal_example">
        <SliderPage/>
      </div>
    )
  );
