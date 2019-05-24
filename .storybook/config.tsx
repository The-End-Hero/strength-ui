import React from "react";
import { configure, addDecorator, addParameters } from "@storybook/react";
import { themes } from "@storybook/theming";
import { name, repository, version} from "../package.json";
import { withInfo } from "@storybook/addon-info";
import { withNotes } from "@storybook/addon-notes";
import { configureActions } from "@storybook/addon-actions";
import { withOptions } from "@storybook/addon-options";
import "@storybook/addon-console";
// import "../components/styles/index.less";
import "../stories/styles/code.less";

function loadStories() {
  // // 地图工具栏
  require("../stories/maptool");
}

configureActions({
  depth: 100
});
addParameters({
  options: {
    // name: `${name} v${version}`,
    // url: repository,
    brandUrl: repository,
    brandTitle: `${name} v${version}`,
    sidebarAnimations: true
  }
});
addDecorator(withInfo({
  header: true,
  maxPropsIntoLine: 100,
  maxPropObjectKeys: 100,
  maxPropArrayLength: 100,
  maxPropStringLength: 100,
  styles: {
    header: {
      h1: {
        marginRight: "20px",
        fontSize: "25px",
        display: "inline"
      },
      body: {
        paddingTop: 0,
        paddingBottom: 0
      },
      h2: {
        display: "inline",
        color: "#999"
      }
    },
    infoBody: {
      backgroundColor: "#eee",
      padding: "0px 5px",
      lineHeight: "2"
    }
  },
  inline: true,
  source: false
}));
addDecorator(withNotes);


addDecorator(story => <div style={{ padding: "0 60px 50px" }}>{story()}</div>);

configure(loadStories, module);
