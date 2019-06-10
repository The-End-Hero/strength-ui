import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/checkbox/styles.less";
import CheckBox from "../components/checkbox/index";
import "../components/button/styles.less";
import Button from "../components/button/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";

storiesOf("普通", module).add(
  "checkbox 选择框",
  () => (
    <div className="input_example">
      <h2>基本使用</h2>
      <CheckBox
        label="开关"
        checked={true}
        onChange={action()}
      />

      <h2>tips</h2>
      <CheckBox
        label="开关"
        tips='描述'
        checked={false}
        onChange={action()}
      />

      <h2>width:100px</h2>
      <CheckBox
        style={{ width: 100 }}
        label="开关"
        tips='描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述'
        checked={false}
        onChange={action()}
      />
    </div>
  )
);
