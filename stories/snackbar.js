import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/snackbar/styles.less";
import SnackBar from "../components/snackbar/index";
import "../components/button/styles.less";
import Button from "../components/button/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";

storiesOf("组件", module).add(
  "snackbar 提示气泡框",
  () => (
    <div className="input_example">
      <h2>成功</h2>
      <Button onClick={()=>{
        SnackBar.info('success','成功')
      }}>成功</Button>

      <h2>警告</h2>
      <Button onClick={()=>{
        SnackBar.info('warning','警告')
      }}>警告</Button>

      <h2>失败</h2>
      <Button onClick={()=>{
        SnackBar.info('error','失败')
      }}>失败</Button>
    </div>
  )
);
