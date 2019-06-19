import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/input/styles.less";
import Input from "../components/input/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";
import { 
  WireIcon,
  CloseIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  CheckBoxIcon,
  MCLoadingIcon
} from "../components/icon";
import "../components/icon/styles.less";


storiesOf("组件", module).add(
  "icon 图标",
  () => (
    <div className="input_example">
      <h2>线型地理Icon</h2>
      <WireIcon type='POINT'/>
      <WireIcon type='LINE'/>
      <WireIcon type='POLYGON'/>
      <WireIcon type='MAP'/>
      

      <h2>CloseIcon</h2>
      <CloseIcon/>


      <h2>提示，警告，错误</h2>
      <WarningIcon/>
      <ErrorIcon/>
      <InfoIcon/>

      <h2>loading</h2>
      <MCLoadingIcon className="mc-loading"/>
      
      
      <h2>CheckBoxIcon</h2>
      <CheckBoxIcon type="UNCHECKED"/>
      <CheckBoxIcon type="CHECKED"/>
      <CheckBoxIcon type="CHECKED_RADIUS"/>
      <CheckBoxIcon type="UNCHECKED_RADIUS"/>
      <CheckBoxIcon type="CHECKED_SOME"/>
    </div>
  )
);
