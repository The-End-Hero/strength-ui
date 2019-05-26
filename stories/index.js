import React from "react";
import { storiesOf } from "@storybook/react";
import { name, repository, author } from "../package.json";

storiesOf("综述", module)
  .add("介绍", () => (
    <article style={{ padding: 20 }} className="index-page">
      <h1 style={{ fontSize: 40, padding: 0, margin: 0 }}>
        {name}
      </h1>
        業餘之作
    </article>
  ))
