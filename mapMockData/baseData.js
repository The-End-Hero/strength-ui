export const data = {
  cards: [
    {
      uid: "card_843eac20-2f5b-11e9-9db6-c9f89d2561f2",
      items: [
        {
          filters: [
            {
              uid: "filter_27af1d30-43da-11e9-bcf9-b1362417a02f",
              fliters: true, // 全局筛选器条件
              style: true, // 有颜色
              show_col: true, // 有无展示文本
              info_cfg: true, // 有无展示卡片
              cur_visual: true // 有无可视化
            }
          ],
          geometry_type: "point",
          object_type: "上海 沙县_1548397641151",
          packageId: 535,
          source: "customer"
        }
      ],
      geo_filters: { // 当前cards的围栏筛选类型
        type: 1,
        geoJson: {
          type: "MultiPolygon",
          crs: {
            type: "name",
            properties: { name: "EPSG:4326" }
          },
          coordinates: [
            [
              [121.38419396675002, 31.312646077099973],
              [121.21962603599553, 31.115592902654885],
              [121.6373120657848, 31.07813752488004],
              [121.38419396675002, 31.312646077099973]
            ]
          ]
        }

        // type: 2, // 圆
        // circles: [
        //   [121.3211347190533, 31.28751977617709, 11144.587998739802]
        // ],
        //
        // type: 4,
        // filters: [
        //   {
        //     id: "上海边界_街镇最新(数据中心)_974514",
        //     name: "南桥镇",
        //     oid: "974514",
        //     packageId: 38,
        //     pid: "上海边界_街镇最新(数据中心)",
        //     source: "market"
        //   }
        // ],
        // object_type: "上海边界_街镇最新(数据中心)",
        // packageId: 38,
        // source: "market"
      }

    }
  ],
  static_cards: [],


  map_style: "base",
  init_type: false,
  is_static_map: false,
  map_state: "3", // 当前地图状态。 比如 点选 绘制，buffer等


  current_geo_filter: {
    filters: [ // 围栏可视化
      {
        uid: "filter_uid",
        style: {
          color: "#00968E",
          fillOpacity: 0,
          strokeDasharray: [0, 0, 0, 0],
          strokeOpacity: 1,
          strokeStyle: "solid",
          strokeWeight: 1
        }
      }
    ],
    geometry_type: "polygon",
    object_type: "上海边界_区县最新(数据中心)",
    packageId: 38,
    source: "market"
  },
  map_info: {
    location: "121.410779,31.174219",
    scale: 1,
    size: "400*400",
    zoom: 10
  },
  screening_method: "intersects",
  data_alias: {}, // 数据别名
  refresh_time: 0, //更新时间


  data_style: { // 数据样式

  },
  data_info_cfg: { // 数据展示卡片
    "key": {
      single: [
        {
          db: "str",
          h_type: "text",
          h_value: "地址",
          key: "address",
          selected: true
        }
      ],
      from: [],
      to: []
    }
  },
  data_show_col: { // 数据展示字段
    "":{
      
    }
  },
  data_fliters: { // 数据全局筛选条件

  },
  data_cur_visual: { // 数据当前可视化

  },
  data_config_1: { // 数据数值可视化配置

  },
  data_config_2: { // 数据分类可视化配置

  },
  data_config_3: { // 数据热力配置

  },
  data_config_4: { // 数据栅格热力配置

  },
  data_config_5: { // 数据六边形热力配置

  },
  data_config_6: { // 数据流向图配置

  }


};
const dat = {
  "rc": 0,
  "result": {
    "new_interactive_map": [{
      "create_time": "2019-02-13 14:49:40",
      "extra": {
        "name": "geo_88eaa800-2f5b-11e9-9db6-c9f89d2561f2",
        "type": "new_interactive_map",
        "cards": [{
          "uid": "card_843eac20-2f5b-11e9-9db6-c9f89d2561f2",
          "items": [{
            "source": "customer",
            "filters": [{
              "uid": "filter_27af1d30-43da-11e9-bcf9-b1362417a02f",
              "style": {
                "icon": {
                  "icon": "icon-location_1",
                  "content": "\\ue900"
                },
                "color": "#FFA74F"
              },
              "filters": [{
                "db": "str",
                "key": "\u6807\u7b7e",
                "list": ["\u7f8e\u98df;\u5c0f\u5403\u5feb\u9910\u5e97"],
                "h_type": "text",
                "h_value": "\u6807\u7b7e"
              }],
              "config_2": {
                "extra.\u6807\u7b7e": {
                  "deps": "extra.\u6807\u7b7e",
                  "range": ["#FF4F4F"],
                  "domain": ["\u7f8e\u98df;\u5c0f\u5403\u5feb\u9910\u5e97"],
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
              "config_4": {
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
                    },
                    "dataMode": {
                      "type": "dataMode",
                      "value": "sum"
                    }
                  },
                  "subType": "heatMap_4",
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
                  "visualize_type": 4,
                  "selectExampleColor": 0
                }
              },
              "config_5": {
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
                    },
                    "dataMode": {
                      "type": "dataMode",
                      "value": "sum"
                    }
                  },
                  "subType": "heatMap_6",
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
                  "visualize_type": 5,
                  "selectExampleColor": 0
                }
              },
              "info_cfg": [{
                "db": "str",
                "key": "address",
                "h_type": "text",
                "h_value": "\u5730\u5740",
                "selected": true
              }, {
                "db": "str",
                "key": "name",
                "h_type": "text",
                "h_value": "\u540d\u79f0",
                "selected": true
              }, {
                "db": "str",
                "key": "\u6807\u7b7e",
                "h_type": "text",
                "h_value": "\u6807\u7b7e",
                "selected": true
              }],
              "show_col": "name"
            }],
            "packageId": "",
            "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
            "geometry_type": "point"
          }],
          "geo_filters": {
            "type": "1",
            "geoJson": {
              "crs": {
                "type": "name",
                "properties": {
                  "name": "EPSG:4326"
                }
              },
              "type": "MultiPolygon",
              "coordinates": [
                [
                  [
                    [121.384193967, 31.3126460771],
                    [121.219626036, 31.1155929027],
                    [121.637312066, 31.0781375249],
                    [121.384193967, 31.3126460771]
                  ]
                ]
              ]
            }
          }
        }],
        "title": "test123",
        "map_info": {
          "size": "400*400",
          "zoom": 11,
          "scale": 1,
          "location": "121.43831999999992,31.18540386083521"
        },
        "init_type": true,
        "map_style": "base",
        "data_alias": {},
        "geo_filter": [{
          "source": "market",
          "current": true,
          "filters": [{
            "uid": "filter_bd1fde10-43d8-11e9-8714-0b0860d54be1",
            "style": {
              "color": "#00968E",
              "fillOpacity": 0
            }
          }],
          "packageId": 37,
          "object_type": "\u7701\u8fb9\u754c(\u6570\u636e\u4e2d\u5fc3)",
          "geometry_type": "polygon"
        }, {
          "source": "market",
          "filters": [{
            "style": {
              "color": "rgba(255, 255, 79, 1)",
              "fillOpacity": 0,
              "strokeStyle": "solid",
              "strokeWeight": 1,
              "strokeOpacity": 1,
              "strokeDasharray": [0, 0, 0, 0]
            }
          }],
          "packageId": 38,
          "object_type": "\u4e0a\u6d77\u8fb9\u754c_\u8857\u9547\u6700\u65b0(\u6570\u636e\u4e2d\u5fc3)",
          "geometry_type": "polygon"
        }],
        "refresh_time": 0,
        "static_cards": [],
        "supp_filters": [{
          "cols": [{
            "db": "str",
            "key": "\u6807\u7b7e",
            "list": ["\u7f8e\u98df;\u5c0f\u5403\u5feb\u9910\u5e97"],
            "h_type": "text",
            "h_value": "\u6807\u7b7e"
          }],
          "source": "customer",
          "packageId": null,
          "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
          "geometry_type": "point"
        }],
        "buffer_filters": null,
        "is_server_render": true,
        "screening_method": "intersects",
        "current_geo_filter": {
          "source": "market",
          "filters": [{
            "uid": "filter_c0ffd760-43d8-11e9-8714-0b0860d54be1",
            "style": {
              "color": "rgba(255, 255, 79, 1)",
              "fillOpacity": 0,
              "strokeStyle": "solid",
              "strokeWeight": 1,
              "strokeOpacity": 1,
              "strokeDasharray": [0, 0, 0, 0]
            }
          }],
          "packageId": 38,
          "object_type": "\u4e0a\u6d77\u8fb9\u754c_\u8857\u9547\u6700\u65b0(\u6570\u636e\u4e2d\u5fc3)",
          "geometry_type": "polygon"
        },
        "is_card_default_open": false
      },
      "id": 35434,
      "name": "geo_88eaa800-2f5b-11e9-9db6-c9f89d2561f2",
      "status": "normal",
      "update_time": "2019-03-11 17:38:16",
      "privs": ["update", "read", "delete", "modify"]
    }, {
      "create_time": "2019-03-05 16:20:01",
      "extra": {
        "name": "geo_770ede70-3f1f-11e9-aff0-492eb5a3fd23",
        "type": "new_interactive_map",
        "cards": [{
          "uid": "card_98848af1-3f1f-11e9-aff0-492eb5a3fd23",
          "items": [{
            "source": "customer",
            "filters": [{
              "uid": "filter_9884b200-3f1f-11e9-aff0-492eb5a3fd23",
              "style": {
                "icon": {
                  "icon": "marker-15.svg",
                  "content": "marker"
                },
                "color": "#FF4F4F"
              },
              "filters": []
            }],
            "packageId": "",
            "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
            "geometry_type": "point"
          }],
          "geo_filters": null
        }],
        "title": "000",
        "map_info": {
          "size": "400*400",
          "zoom": 10,
          "scale": 1,
          "location": "121.41733609999993,31.17873036006657"
        },
        "init_type": true,
        "map_style": "base",
        "data_alias": {},
        "geo_filter": [],
        "refresh_time": 0,
        "static_cards": [],
        "supp_filters": [{
          "source": "customer",
          "packageId": null,
          "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
          "geometry_type": "point"
        }],
        "buffer_filters": null,
        "is_server_render": true,
        "screening_method": "intersects",
        "current_geo_filter": {
          "filters": []
        },
        "is_card_default_open": false
      },
      "id": 36367,
      "name": "geo_770ede70-3f1f-11e9-aff0-492eb5a3fd23",
      "status": "normal",
      "update_time": "2019-03-05 16:20:57",
      "privs": ["update", "read", "delete", "modify"]
    }],
    "geo_visualization": [{
      "create_time": "2019-03-08 18:09:57",
      "extra": {
        "name": "geo_52464520-418a-11e9-8b74-99b692323cc0",
        "type": "geo_visualization",
        "cards": [{
          "uid": "card_4a6472a1-418a-11e9-8b74-99b692323cc0",
          "items": [{
            "source": "customer",
            "filters": [{
              "uid": "filter_4a6472a0-418a-11e9-8b74-99b692323cc0",
              "style": {
                "icon": {
                  "icon": "icon-location_1",
                  "content": "\\ue900"
                },
                "color": "#FF4F4F"
              },
              "filters": []
            }],
            "packageId": 535,
            "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
            "geometry_type": "point"
          }]
        }],
        "title": "23456",
        "map_info": {
          "size": "400*400",
          "zoom": 10,
          "scale": 1,
          "location": "121.410821,31.174054"
        }
      },
      "id": 36598,
      "name": "geo_52464520-418a-11e9-8b74-99b692323cc0",
      "status": "normal",
      "update_time": "2019-03-08 18:09:57",
      "privs": ["update", "read", "delete", "modify"]
    }, {
      "create_time": "2019-03-07 14:08:15",
      "extra": {
        "name": "geo_637db030-409f-11e9-916c-897bcc579f5f",
        "type": "geo_visualization",
        "cards": [{
          "uid": "card_5a385611-409f-11e9-916c-897bcc579f5f",
          "items": [{
            "source": "customer",
            "filters": [{
              "uid": "filter_5a385610-409f-11e9-916c-897bcc579f5f",
              "style": {
                "icon": {
                  "icon": "icon-location_1",
                  "content": "\\ue900"
                },
                "color": "#FF4F4F"
              },
              "filters": []
            }],
            "packageId": 535,
            "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
            "geometry_type": "point"
          }]
        }],
        "title": "2345",
        "map_info": {
          "size": "400*400",
          "zoom": 10,
          "scale": 1,
          "location": "121.410821,31.174054"
        }
      },
      "id": 36540,
      "name": "geo_637db030-409f-11e9-916c-897bcc579f5f",
      "status": "normal",
      "update_time": "2019-03-07 14:08:15",
      "privs": ["update", "read", "delete", "modify"]
    }, {
      "create_time": "2019-03-07 10:33:06",
      "extra": {
        "name": "geo_544752b0-4081-11e9-94b4-0b34799466ee",
        "type": "geo_visualization",
        "cards": [{
          "uid": "card_4eb3b5f1-4081-11e9-94b4-0b34799466ee",
          "items": [{
            "source": "customer",
            "filters": [{
              "uid": "filter_4eb3b5f0-4081-11e9-94b4-0b34799466ee",
              "style": {
                "icon": {
                  "icon": "icon-location_1",
                  "content": "\\ue900"
                },
                "color": "#FF4F4F"
              },
              "filters": []
            }],
            "packageId": null,
            "object_type": "\u4e0a\u6d77 \u6c99\u53bf_1548397641151",
            "geometry_type": "point"
          }]
        }],
        "title": "2345",
        "map_info": {
          "size": "400*400",
          "zoom": 10,
          "scale": 1,
          "location": "121.410821,31.174054"
        }
      },
      "id": 36525,
      "name": "geo_544752b0-4081-11e9-94b4-0b34799466ee",
      "status": "normal",
      "update_time": "2019-03-07 10:33:06",
      "privs": ["update", "read", "delete", "modify"]
    }]
  }
}
