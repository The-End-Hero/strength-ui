import React from "react";
import { storiesOf } from "@storybook/react";
import Amap from "../components/amap";          //引入你的组件
import { withInfo } from "@storybook/addon-info";
import "../components/amap/styles.less";
import { data1, data2 } from "../components/amap/testData/testData";
import AmapPage from "./pages/amap";
import "../static/font/material-icons.css";
import "../static/font/font-awesome/css/font-awesome.min.css";
import "../static/font/mdt_fonts/mdt_font.css";

storiesOf("地图组件(前端渲染)", module)
  .add("静态地图/非静态地图",
    () => (// 添加到页面上
      <div>
        <h3>静态地图</h3>
        <div style={{ width: 1200, height: 500, backgroundColor: "red" }}>
          <Amap is_static_map={true}/>
        </div>
        <br/>
        <h3>非静态地图</h3>
        <div style={{ width: 1200, height: 500, backgroundColor: "red" }}>
          <Amap
            is_static_map={false}/>
        </div>
      </div>// 这里写jsx
    ))
  .add("地图样式",
    () => (// 添加到页面上
      <div>
        <h3>默认</h3>
        <div style={{ width: 1200, height: 500, backgroundColor: "red" }}>
          <Amap map_style='base'
                is_static_map={false}/>
        </div>
        <br/>
        <h3>浅色</h3>
        <div style={{ width: 1200, height: 500, backgroundColor: "red" }}>
          <Amap map_style='normal'
                is_static_map={false}/>
        </div>
        <br/>
        <h3>卫星</h3>
        <div style={{ width: 1200, height: 500, backgroundColor: "red" }}>
          <Amap map_style='wxt'
                is_static_map={false}/>
        </div>
      </div>// 这里写jsx
    ))
  .add("基础版渲染交互",
    () => (// 添加到页面上
      <AmapPage/>// 这里写jsx
    ));
