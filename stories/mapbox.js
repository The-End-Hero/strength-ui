import React from "react";
import { storiesOf } from "@storybook/react";
// import MapBox from "../components/mapbox";          //引入你的组件
import "../components/mapbox/styles.less";
import { withInfo } from "@storybook/addon-info";
// import { data1, data2 } from "../components/amap/testData/testData";
import MapBoxPage from "./pages/mapboxpage";
import "../static/font/material-icons.css";
import "../static/font/font-awesome/css/font-awesome.min.css";
import "../static/font/mdt_fonts/mdt_font.css";

storiesOf("box地图组件(瓦片渲染)", module)
  .add("box基础版渲染交互",
    () => (// 添加到页面上
      <MapBoxPage/>// 这里写jsx
    ));

