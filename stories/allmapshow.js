import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/sketchpicker/styles.less";
import "../components/sketchpickerpoi/styles.less";
import SketchPicker from "../components/sketchpicker/index";
import SketchPickerPoi from "../components/sketchpickerpoi/index";
import { withInfo } from "@storybook/addon-info";
import "../static/font/material-icons.css";
import "../static/font/font-awesome/css/font-awesome.min.css";
import "../static/font/mdt_fonts/mdt_font.css";
import "../components/styles/index.less";

import AmapAllPage from "./pages/allmapshowPage/amapall";
import MaptalksAllPage from "./pages/MaptalksAllPage/MaptalksAllPage";

storiesOf("完全版地图", module)
  .add("amap版",
    () => (
      <div style={{ paddingLeft: 100 }}>
        amap版
        <AmapAllPage/>
      </div>
    ))
  .add("栅格瓦片版",
    () => (
      <div style={{ paddingLeft: 100 }}>
        栅格瓦片版
        <MaptalksAllPage/>
      </div>
    ));


