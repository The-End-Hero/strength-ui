import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/input/styles.less";
import Input from "../components/input/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";

import { SuccessIcon } from "../components/icon";

storiesOf("普通", module).add(
  "input 输入框",
  () => (
    <div className="input-example">
      <h2>基本使用</h2>
      <Input onClick={action("clicked")}/>

      <h2>单位</h2>
      <Input unitText="米" onClick={action("clicked")}/>

      <h2>验证码</h2>
      <Input placeholder="验证码" kind='vcode' onClick={action("clicked")}/>

      <h2>验证码</h2>
      <Input placeholder="验证码" kind='vcode_countdown' onClick={action("clicked")}/>

      <h2>密码</h2>
      <Input placeholder="请输入密码" type='password' onClick={action("clicked")}/>

      <h2>搜索</h2>
      <Input kind='search' placeholder="我是个搜索" onChange={action("changed")}/>


      <h2>搜索</h2>
      <Input kind='search' placeholder="我是个搜索" onChange={action("changed")}/>

      <h2>错误</h2>
      <Input isError errorText="错误信息" onClick={action("clicked")}/>
      <Input isError errorText="错误信息" unitText="米" onClick={action("clicked")}/>
      <Input isError errorText="错误信息" placeholder="请输入密码" type='password' onClick={action("clicked")}/>

      <h2>select</h2>
      <Input selectLabel={[<div>上海人口</div>]} onClick={action("clicked")}/>


      <h2>allowClear</h2>
      <Input selectLabel={[<div>上海人口</div>]} value='陆家嘴' allowClear onClick={action("clicked")}/>
    </div>
  )
);
