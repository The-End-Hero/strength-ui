import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/mapcards/styles.less";
import MapCards from "../components/mapcards/index";
import { withInfo } from "@storybook/addon-info";
import "../static/font/material-icons.css";
import "../static/font/font-awesome/css/font-awesome.min.css";
import "../static/font/mdt_fonts/mdt_font.css";
import "../components/styles/index.less";

storiesOf("地图展示卡片", module)
  .add("地图展示卡片",
    () => (// 添加到页面上
      <div style={{ display: "flex", flexDirection: "row-reverse", paddingRight: 100 }}>
        <MapCards/>
      </div>
    ));

