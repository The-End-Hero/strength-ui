import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/checkbox/styles.less";
import Modals from "../components/modals/index";
import "../components/modals/styles.less";
import Button from "../components/button/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";

storiesOf("普通", module).add(
    "checkbox 选择框",
    () => (
        <div className="input-example">
            <h2>基本使用</h2>
            <Modals
                label="开关"
                checked={true}
                onChange={action()}
            />
        </div>
    )
);
