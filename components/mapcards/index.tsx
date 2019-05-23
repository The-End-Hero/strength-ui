import React, { Component } from "react";
import * as maptalks from "maptalks";
import mix from "mix-with";
import PointMixin from "./mixins/pointMixin";
import { source_customer } from "../../constants/constants";
import axios from "axios";
import "maptalks/dist/maptalks.css";
import isEqual from "lodash/isEqual";
import cls from "classnames";
import map from "lodash/map";

import { self_select, dis_select, geo_types } from "../../constants/constants";
// import cardsUtil from "./utils/cardsUtil";

const uuidv1 = require("uuid/v1");

class MapCards extends Component<any, any> {
  static defaultProps = {};
  getPointVisual:any
  constructor(props) {
    super(props);
    this.state = {
      show_detail: true,
      data_alias: {},
      cards: [{
        "uid": "card_9f9e91e0-4407-11e9-b091-ef4b241f7f26",
        "items": [{
          "source": "market",
          "filters": [{
            "uid": "filter_87b5da60-4408-11e9-b091-ef4b241f7f26",
            "VList": [{
              "id": 1,
              "subs": [{
                "db": "int",
                "key": "hour",
                "h_type": "number",
                "h_value": "hour"
              }],
              "h_value": "\u6570\u503c\u53ef\u89c6\u5316"
            }, {
              "id": 2,
              "subs": [{
                "db": "str",
                "key": "\u662f\u5426\u6362\u4e58",
                "h_type": "text",
                "h_value": "\u662f\u5426\u6362\u4e58"
              }],
              "h_value": "\u5206\u7c7b\u53ef\u89c6\u5316"
            }, {
              "id": 3,
              "subs": [{
                "key": "__by_count__",
                "h_value": "\u70b9\u4f4d"
              }],
              "h_value": "\u751f\u6210\u70ed\u529b\u56fe"
            }, {
              "id": 4,
              "subs": [{
                "key": "__by_count__",
                "h_value": "\u70b9\u4f4d"
              }],
              "h_value": "\u751f\u6210\u6805\u683c\u70ed\u529b"
            }],
            "style": {
              "icon": {
                "icon": "icon-location_1",
                "content": "\\ue900"
              },
              "color": "rgba(255, 79, 79, 1)"
            },
            "hidden": true,
            "filters": [],
            "config_1": {
              "extra.hour": {
                "cLen": 7,
                "deps": "extra.hour",
                "range": ["rgb(0, 0, 255)", "rgb(0, 138, 247)", "rgb(0, 228, 192)", "rgb(15, 254, 87)", "rgb(87, 254, 15)", "rgb(192, 228, 0)", "rgb(247, 138, 0)", "#FF4F4F"],
                "domain": [5, 8, 10, 13, 15, 18, 20, 23],
                "breakType": "custom",
                "reverseColor": false,
                "visualize_type": 1,
                "selectExampleColor": 0
              }
            },
            "config_2": {
              "extra.\u662f\u5426\u6362\u4e58": {
                "deps": "extra.\u662f\u5426\u6362\u4e58",
                "range": ["#FF4F4F", "rgba(255, 255, 221, 1)"],
                "domain": ["\u6362\u4e58", "\u975e\u6362\u4e58"],
                "visualize_type": 2
              }
            },
            "config_3": {
              "extra.__by_count__": {
                "type": "heatmap",
                "module": {
                  "color": {
                    "type": "color",
                    "value": [{
                      "k": 1,
                      "v": "rgb(247, 138, 0)"
                    }, {
                      "k": 0.857142857143,
                      "v": "rgb(192, 228, 0)"
                    }, {
                      "k": 0.714285714286,
                      "v": "rgb(87, 254, 15)"
                    }, {
                      "k": 0.571428571428999,
                      "v": "rgb(15, 254, 87)"
                    }, {
                      "k": 0.428571428571,
                      "v": "rgb(0, 228, 192)"
                    }, {
                      "k": 0.285714285714,
                      "v": "rgb(0, 138, 247)"
                    }, {
                      "k": 0.142857142857,
                      "v": "rgb(0, 0, 255)"
                    }],
                    "column": ""
                  },
                  "radius": {
                    "type": "radius",
                    "value": 20,
                    "column": ""
                  }
                },
                "subType": "normal",
                "blendMode": "",
                "reverseColor": false,
                "custom_colors": [{
                  "color": "rgb(0,0,255)",
                  "offset": 0.45
                }, {
                  "color": "rgb(0,255,255)",
                  "offset": 0.55
                }, {
                  "color": "rgb(0,255,0)",
                  "offset": 0.65
                }, {
                  "color": "yellow",
                  "offset": 0.9500000000000001
                }, {
                  "color": "rgb(255,0,0)",
                  "offset": 1
                }],
                "current_colors": ["rgb(0, 0, 255)", "rgb(0, 138, 247)", "rgb(0, 228, 192)", "rgb(15, 254, 87)", "rgb(87, 254, 15)", "rgb(192, 228, 0)", "rgb(247, 138, 0)"],
                "visualize_type": 3,
                "selectExampleColor": 0
              }
            },
            "cur_visual": {
              "col": "extra.\u662f\u5426\u6362\u4e58",
              "type": 2,
              "title": "\u662f\u5426\u6362\u4e58"
            }
          }],
          "packageId": 2125,
          "object_type": "\u4e0a\u6d77\u5730\u94c1_\u7ad9\u70b9\u6d41\u91cf_2018\u5468\u672b(\u6570\u636e\u4e2d\u5fc3)",
          "geometry_type": "point"
        }, {
          "source": "market",
          "filters": [{
            "uid": "filter_97df99f0-4465-11e9-ab94-2f79004145c2",
            "style": {
              "icon": {
                "icon": "icon-location_1",
                "content": "\\ue900"
              },
              "color": "#FFA74F"
            },
            "filters": [{
              "db": "str",
              "key": "\u7b49\u7ea7",
              "list": ["\u4e94\u661f\u5546\u6237", "\u51c6\u4e94\u661f\u5546\u6237", "\u56db\u661f\u5546\u6237"],
              "h_type": "text",
              "h_value": "\u7b49\u7ea7"
            }],
            "config_3": {
              "extra.\u5e73\u5747\u6d88\u8d39": {
                "type": "heatmap",
                "module": {
                  "color": {
                    "type": "color",
                    "value": [{
                      "k": 1,
                      "v": "rgb(247, 138, 0)"
                    }, {
                      "k": 0.8571428571428571,
                      "v": "rgb(192, 228, 0)"
                    }, {
                      "k": 0.7142857142857141,
                      "v": "rgb(87, 254, 15)"
                    }, {
                      "k": 0.5714285714285711,
                      "v": "rgb(15, 254, 87)"
                    }, {
                      "k": 0.42857142857142805,
                      "v": "rgb(0, 228, 192)"
                    }, {
                      "k": 0.28571428571428503,
                      "v": "rgb(0, 138, 247)"
                    }, {
                      "k": 0.14285714285714202,
                      "v": "rgb(0, 0, 255)"
                    }],
                    "column": ""
                  },
                  "radius": {
                    "type": "radius",
                    "value": 20,
                    "column": ""
                  }
                },
                "subType": "normal",
                "blendMode": "",
                "reverseColor": false,
                "custom_colors": [{
                  "color": "rgb(0,0,255)",
                  "offset": 0.45
                }, {
                  "color": "rgb(0,255,255)",
                  "offset": 0.55
                }, {
                  "color": "rgb(0,255,0)",
                  "offset": 0.65
                }, {
                  "color": "yellow",
                  "offset": 0.9500000000000001
                }, {
                  "color": "rgb(255,0,0)",
                  "offset": 1
                }],
                "current_colors": ["rgb(0, 0, 255)", "rgb(0, 138, 247)", "rgb(0, 228, 192)", "rgb(15, 254, 87)", "rgb(87, 254, 15)", "rgb(192, 228, 0)", "rgb(247, 138, 0)"],
                "visualize_type": 3,
                "selectExampleColor": 0
              }
            },
            "cur_visual": {
              "col": "extra.\u5e73\u5747\u6d88\u8d39",
              "type": 3,
              "title": "\u5e73\u5747\u6d88\u8d39"
            }
          }],
          "packageId": 1641,
          "object_type": "\u4e0a\u6d77\u5546\u4e1a_\u9910\u996e\u5ba2\u5355\u4ef7\u53ca\u70b9\u8bc4(\u6570\u636e\u4e2d\u5fc3)",
          "geometry_type": "point"
        }],
        "geo_filters": {
          "type": "4",
          "source": "customer",
          "filters": [{
            "id": "\u4e0a\u6d77\u533a\u53bf_10024115",
            "oid": "10024115",
            "pid": "\u4e0a\u6d77\u533a\u53bf",
            "name": "\u5f90\u6c47",
            "source": "customer",
            "packageId": 74
          }],
          "packageId": 74,
          "object_type": "\u4e0a\u6d77\u533a\u53bf"
        }
      }]
    };
  }

  componentDidMount() {
  }

  async componentWillReceiveProps(nextProps) {
  }

  getGeoText = (card) => {
    const { geo_filters } = card;
    if (this.props.hasBuffer) {
      return "buffer选区";
    }
    if (!geo_filters) {
      return "全部";
    }
    if (geo_filters.type == self_select || geo_filters.type == dis_select) {
      return "自助选择范围";
    }
    const allStreets = map(geo_filters.filters, t => {
      return t.name;
    });
    return allStreets.join(",") || geo_filters.object_type || "未选择";
  };
  getVisualItem = (item) => {
    const { geometry_type, filters } = item;
    let filter = filters[0];
    let visualitem;
    switch (geometry_type) {
      case geo_types.point:
        visualitem = this.getPointVisual(filter);
        break;
      case geo_types.polygon:
        visualitem = this.getPolygonVisual();
        break;
      case geo_types.line:
        visualitem = this.getLineVisual();
        break;
      case geo_types.point_to_point:
        visualitem = this.getPointToPointVisual();
        break;
    }
    return visualitem;
  };
  getPolygonVisual = () => {
  };
  getLineVisual = () => {
  };
  getPointToPointVisual = () => {
  };
  becomeSimple = () => {
    this.setState({
      show_detail: false
    });
  };

  render() {
    const { cards, data_alias, show_detail } = this.state;
    const card = cards[0];
    const { items, geo_filters } = card;
    const GeoText = this.getGeoText(card);
    return [
      <div key='detail' className={cls("mc_mapcards animated", { hidden: !show_detail })}>
        <div className={cls("mc_mapcards_topline")}></div>
        <div className={cls("mc_mapcards_list", { static_cards: false })}>
          <div className={cls("mc_mapcards_geotext")}>
            <span className='mc_mapcards_geotext_name'>{GeoText}</span>
            <div className="mc_mapcards_hide" onClick={this.becomeSimple}>
              <i className="material-icons"></i>
            </div>
            <div className="mc_mapcards_more_menu">
              <i className="material-icons">more_vert</i>
            </div>
          </div>
          {
            items.map((current, index) => {
              const { source, packageId, object_type, geometry_type, filters } = current;
              const alias = data_alias ? data_alias[`${object_type}${geometry_type}${source}${packageId}`] : "";

              return (
                <div key={`${source}${packageId}${object_type}${geometry_type}`}>
                  <div className='mc_mapcards_item_data_name'>{alias ? alias : `${object_type}`}</div>
                  {this.getVisualItem(current)}
                </div>
              );
            })
          }
        </div>
      </div>,
      <div key='simple' className={cls("mc_mapcards animated", { hidden: show_detail })}>
        123
      </div>
    ];
  }
}

const MixMapCards = mix(MapCards).with(
  PointMixin
);
export default MixMapCards;
