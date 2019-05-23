import React, { Component } from "react";
import mix from "mix-with";
import map from "lodash/map";
import cls from "classnames";
import { geo_types } from "../../../../constants/constants";

import point_icon from "../../../../static/geo/point.png";
import polygon_icon from "../../../../static/geo/polygon.png";
import line_icon from "../../../../static/geo/line.png";


// const point_icon = require("../../../../static/geo/point.png");
// const polygon_icon = require("../../../../static/geo/polygon.png");
// const line_icon = require("../../../../static/geo/line.png");

interface IProps {
  type?: string,
  style?: object,
}

interface IState {
  showMore: boolean
}

class GeoTypesIcon extends Component <IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false
    };
  }

  switchType = (type) => {
    console.log(type,'type')
    console.log(geo_types,'geo_types')
    let url;
    switch (type) {
      case geo_types.point:
        url = point_icon;
        break;
      case geo_types.line:
        url = line_icon;
        break;
      case geo_types.polygon:
        url = polygon_icon;
        break;
      case geo_types.point_to_point:
        url = line_icon;
        break;
      default:
        url = point_icon;
        break;
    }
    return url;
  };

  render() {
    const { type, style } = this.props;
    const url = this.switchType(type);
    return (
      <span className={cls("mc_map_geo_type_icon", {})} style={{ ...style }}>
        <img src={url} alt="type"/>
      </span>
    );
  }
}

const MixGeoTypesIcon = GeoTypesIcon;// mix(GeoTypesIcon).with();
export default MixGeoTypesIcon;
