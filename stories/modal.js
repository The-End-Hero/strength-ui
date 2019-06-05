import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/checkbox/styles.less";
import Modal from "../components/modals/index";
import "../components/modals/styles.less";
import Button from "../components/button/index";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import "../components/styles/index.less";
import "./style.less";
import ModalPage from './pages/modal'

storiesOf("普通", module).add(
    "modal 弹窗",
    () => (
        <div className="input-example">
            <h2>基本使用</h2>
            <Button
                onClick={() => {
                    Modal.info({
                        title: "react",
                        content: "厉害"
                    })
                }}
            >
                Modal.info()
            </Button>
            <ModalPage/>
        </div>
    )
);
