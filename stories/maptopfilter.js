import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/maptopfilter/styles.less";
import MapTopFilter from "../components/maptopfilter/index";
// import { withInfo } from "@storybook/addon-info";
import "../static/font/material-icons.css";
import "../static/font/font-awesome/css/font-awesome.min.css";
import "../static/font/mdt_fonts/mdt_font.css";
import "../components/styles/index.less";


storiesOf("地图头部筛选栏", module)
  .add("地图头部筛选栏",
    () => (// 添加到页面上
      <div style={{ display: "flex", paddingRight: 100 }}>
        <MapTopFilter/>
      </div>
    ));

