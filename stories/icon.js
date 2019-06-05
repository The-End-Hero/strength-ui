import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/input/styles.less";
import Input from "../components/input/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";
import { WireIcon, CloseIcon } from "../components/icon";
import '../components/icon/styles.less' 


storiesOf("普通", module).add(
  "icon 图标",
  () => (
    <div className="input-example">
      <h2>基本使用</h2>
      <WireIcon type='POINT'/>
      <WireIcon type='LINE'/>
      <WireIcon type='POLYGON'/>
      <WireIcon type='MAP'/>

      <CloseIcon/>
    </div>
  )
);
