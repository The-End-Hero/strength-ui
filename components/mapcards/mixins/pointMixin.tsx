import * as maptalks from "maptalks";
import { bmapStyles } from "../../../utils/mapstyle";
import cardsUtil from "../utils/cardsUtil";
import cls from "classnames";
import React, { Component } from "react";

const PointMixin = superclass => class PointMixin extends superclass {
  getPointVisual = (filter:any) => {
    let { filters, style, hidden, count, cur_visual, size_visual } = filter;
    cur_visual = cur_visual || {};
    filters = filters || []; // 全局筛选器
    let iconLabel = (
      <div className={cls("mc_mapcards_item_poi_icon icomoon",
        style && style.icon.icon)}
           style={{ color: 2 ? style && style.color : "#687495" }}
           onClick={(e) => console.log(123)}
      />
    );
    return (
      <div className={cls("mc_mapcards_item")}>
        <div className={cls("mc_mapcards_item_data")}>
          {iconLabel}
          <div className='mc_mapcards_item_data_filter'>{cardsUtil.getFilterDesc(filters)}</div>
          <div className='mc_mapcards_item_data_filter_num'>{count || 404}</div>
          <div className="mc_mapcards_item_label_btns">
            <div className={cls("mc_mapcards_item_icon_btn_wrap", { disable: !hidden })}
                 onClick={() => {
                 }}>
              {hidden ? <i className="material-icons">&#xE8F4;</i> :
                <i className="material-icons">&#xE8F5;</i>
              }
            </div>
          </div>
        </div>
        {this.getPointVisualDetail({ type: cur_visual.type || 0 })}
        {
          size_visual &&
          <div>我是大小可视化</div>
        }
      </div>
    );
  };
  getPointVisualDetail = (obj):any => {
    let { type } = obj;

    switch (Number(type)) {
      case 0:
        return null;
      case 1:
        return <div>我是detail type={type}</div>;
      case 2:
        return <div>我是detail type={type}</div>;
      case 3:
        return <div>我是detail type={type}</div>;
      case 4:
        return <div>我是detail type={type}</div>;
      case 5:
        return <div>我是detail type={type}</div>;
    }
  };
};

export default PointMixin;
