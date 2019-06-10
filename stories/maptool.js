import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/maptool/styles.less";
import MapTool from "../components/maptool/index";
import { withInfo } from "@storybook/addon-info";
// import "../static/font/material-icons.css";
// import "../static/font/font-awesome/css/font-awesome.min.css";
// import "../static/font/mdt_fonts/mdt_font.css";
import "../components/styles/index.less";

storiesOf("地图工具栏", module)
  .add("地图工具栏",
    () => (// 添加到页面上
      <div style={{ display: "flex", paddingRight: 100 }}>
        <h2>基础版本</h2>
        <MapTool/>
        <h2>半透明</h2>
        <MapTool is_translucent/>
      </div>
    ));

