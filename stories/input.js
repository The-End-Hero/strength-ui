import React from "react";
import { storiesOf } from "@storybook/react";
import "../components/input/styles.less";
import Input from "../components/input/index";
import { withInfo } from "@storybook/addon-info";
import { action } from '@storybook/addon-actions';
import "../components/styles/index.less";
import "./style.less"

import { SuccessIcon } from '../components/icon';

storiesOf('普通', module).add(
  'input 输入框',
  () => (
    <div className="button-example">
      <h2>基本使用</h2>
      <Input onClick={action('clicked')}/>

      <h2>基本使用</h2>
      <Input onClick={action('clicked')}/>
    </div>
  )
);
