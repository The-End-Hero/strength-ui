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

storiesOf("SketchPicker", module)
  .add("SketchPicker_base",
    () => (
      <div style={{ display: "flex", paddingLeft: 100 }}>
        <SketchPicker/>
      </div>
    ))
  .add("SketchPicker_poi",
    () => (
      <div style={{ display: "flex", paddingLeft: 100 }}>
        <SketchPickerPoi/>
      </div>
    ));

