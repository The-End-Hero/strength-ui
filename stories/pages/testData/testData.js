export const data_simple = {
  "create_time": "2019-03-22 14:13:07",
  "extra": {
    "name": "geo_8f3da650-4c69-11e9-b5b8-090a4c32fe29",
    "type": "new_interactive_map",
    "cards": [
      {
        "uid": "card_9f9e91e0-4407-11e9-b091-ef4b241f7f26",
        "items": [
          {
            "source": "market",
            "filters": [
              {
                "uid": "filter_87b5da60-4408-11e9-b091-ef4b241f7f26",
                "VList": [
                  {
                    "id": 1,
                    "subs": [
                      {
                        "db": "int",
                        "key": "hour",
                        "h_type": "number",
                        "h_value": "hour"
                      }
                    ],
                    "h_value": "数值可视化"
                  },
                  {
                    "id": 2,
                    "subs": [
                      {
                        "db": "str",
                        "key": "是否换乘",
                        "h_type": "text",
                        "h_value": "是否换乘"
                      }
                    ],
                    "h_value": "分类可视化"
                  },
                  {
                    "id": 3,
                    "subs": [
                      {
                        "key": "__by_count__",
                        "h_value": "点位"
                      }
                    ],
                    "h_value": "生成热力图"
                  },
                  {
                    "id": 4,
                    "subs": [
                      {
                        "key": "__by_count__",
                        "h_value": "点位"
                      }
                    ],
                    "h_value": "生成栅格热力"
                  }
                ],
                "style": {
                  "icon": {
                    "icon": "icon-location_1",
                    "content": "\ue900"
                  },
                  "color": "rgba(255, 79, 79, 1)"
                },
                "hidden": true,
                "filters": [],
                "config_1": {
                  "extra.hour": {
                    "cLen": 7,
                    "deps": "extra.hour",
                    "range": [
                      "rgb(0, 0, 255)",
                      "rgb(0, 138, 247)",
                      "rgb(0, 228, 192)",
                      "rgb(15, 254, 87)",
                      "rgb(87, 254, 15)",
                      "rgb(192, 228, 0)",
                      "rgb(247, 138, 0)",
                      "#FF4F4F"
                    ],
                    "domain": [
                      5,
                      8,
                      10,
                      13,
                      15,
                      18,
                      20,
                      23
                    ],
                    "breakType": "custom",
                    "reverseColor": false,
                    "visualize_type": 1,
                    "selectExampleColor": 0
                  }
                },
                "config_2": {
                  "extra.是否换乘": {
                    "deps": "extra.是否换乘",
                    "range": [
                      "#FF4F4F",
                      "rgba(255, 255, 221, 1)"
                    ],
                    "domain": [
                      "换乘",
                      "非换乘"
                    ],
                    "visualize_type": 2
                  }
                },
                "config_3": {
                  "extra.__by_count__": {
                    "type": "heatmap",
                    "module": {
                      "color": {
                        "type": "color",
                        "value": [
                          {
                            "k": 1,
                            "v": "rgb(247, 138, 0)"
                          },
                          {
                            "k": 0.857142857143,
                            "v": "rgb(192, 228, 0)"
                          },
                          {
                            "k": 0.714285714286,
                            "v": "rgb(87, 254, 15)"
                          },
                          {
                            "k": 0.571428571428999,
                            "v": "rgb(15, 254, 87)"
                          },
                          {
                            "k": 0.428571428571,
                            "v": "rgb(0, 228, 192)"
                          },
                          {
                            "k": 0.285714285714,
                            "v": "rgb(0, 138, 247)"
                          },
                          {
                            "k": 0.142857142857,
                            "v": "rgb(0, 0, 255)"
                          }
                        ],
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
                    "custom_colors": [
                      {
                        "color": "rgb(0,0,255)",
                        "offset": 0.45
                      },
                      {
                        "color": "rgb(0,255,255)",
                        "offset": 0.55
                      },
                      {
                        "color": "rgb(0,255,0)",
                        "offset": 0.65
                      },
                      {
                        "color": "yellow",
                        "offset": 0.9500000000000001
                      },
                      {
                        "color": "rgb(255,0,0)",
                        "offset": 1
                      }
                    ],
                    "current_colors": [
                      "rgb(0, 0, 255)",
                      "rgb(0, 138, 247)",
                      "rgb(0, 228, 192)",
                      "rgb(15, 254, 87)",
                      "rgb(87, 254, 15)",
                      "rgb(192, 228, 0)",
                      "rgb(247, 138, 0)"
                    ],
                    "visualize_type": 3,
                    "selectExampleColor": 0
                  }
                },
                "cur_visual": {
                  "col": "extra.是否换乘",
                  "type": 2,
                  "title": "是否换乘"
                }
              }
            ],
            "packageId": 2125,
            "object_type": "上海地铁_站点流量_2018周末(数据中心)",
            "geometry_type": "point"
          },
          {
            "source": "market",
            "filters": [
              {
                "uid": "filter_97df99f0-4465-11e9-ab94-2f79004145c2",
                "style": {
                  "icon": {
                    "icon": "icon-location_1",
                    "content": "\ue900"
                  },
                  "color": "#FFA74F"
                },
                "filters": [
                  {
                    "db": "str",
                    "key": "等级",
                    "list": [
                      "五星商户",
                      "准五星商户",
                      "四星商户"
                    ],
                    "h_type": "text",
                    "h_value": "等级"
                  }
                ],
                "config_3": {
                  "extra.平均消费": {
                    "type": "heatmap",
                    "module": {
                      "color": {
                        "type": "color",
                        "value": [
                          {
                            "k": 1,
                            "v": "rgb(247, 138, 0)"
                          },
                          {
                            "k": 0.8571428571428571,
                            "v": "rgb(192, 228, 0)"
                          },
                          {
                            "k": 0.7142857142857141,
                            "v": "rgb(87, 254, 15)"
                          },
                          {
                            "k": 0.5714285714285711,
                            "v": "rgb(15, 254, 87)"
                          },
                          {
                            "k": 0.42857142857142805,
                            "v": "rgb(0, 228, 192)"
                          },
                          {
                            "k": 0.28571428571428503,
                            "v": "rgb(0, 138, 247)"
                          },
                          {
                            "k": 0.14285714285714202,
                            "v": "rgb(0, 0, 255)"
                          }
                        ],
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
                    "custom_colors": [
                      {
                        "color": "rgb(0,0,255)",
                        "offset": 0.45
                      },
                      {
                        "color": "rgb(0,255,255)",
                        "offset": 0.55
                      },
                      {
                        "color": "rgb(0,255,0)",
                        "offset": 0.65
                      },
                      {
                        "color": "yellow",
                        "offset": 0.9500000000000001
                      },
                      {
                        "color": "rgb(255,0,0)",
                        "offset": 1
                      }
                    ],
                    "current_colors": [
                      "rgb(0, 0, 255)",
                      "rgb(0, 138, 247)",
                      "rgb(0, 228, 192)",
                      "rgb(15, 254, 87)",
                      "rgb(87, 254, 15)",
                      "rgb(192, 228, 0)",
                      "rgb(247, 138, 0)"
                    ],
                    "visualize_type": 3,
                    "selectExampleColor": 0
                  }
                },
                "cur_visual": {
                  "col": "extra.平均消费",
                  "type": 3,
                  "title": "平均消费"
                }
              }
            ],
            "packageId": 1641,
            "object_type": "上海商业_餐饮客单价及点评(数据中心)",
            "geometry_type": "point"
          },
          // {
          //   "source": "customer",
          //   "filters": [
          //     {
          //       "uid": "filter_4f0106c0-46d0-11e9-a07e-37d2530261ce",
          //       "style": {
          //         "icon": {
          //           "icon": "icon-location_1",
          //           "content": "\ue900"
          //         },
          //         "color": "#FFA74F"
          //       },
          //       "filters": []
          //     }
          //   ],
          //   "packageId": 80,
          //   "object_type": "上海市 幼儿园",
          //   "geometry_type": "point"
          // }
        ],
        "geo_filters": {
          "type": "4",
          "source": "customer",
          "filters": [
            {
              "id": "上海区县_10024115",
              "oid": "10024115",
              "pid": "上海区县",
              "name": "徐汇",
              "source": "customer",
              "packageId": 74
            }
          ],
          "packageId": 74,
          "object_type": "上海区县"
        }
      }
    ],
    "title": "演示使用_副本",
    "map_info": {
      "size": "400*400",
      "zoom": 12,
      "scale": 1,
      "location": "121.41837099999992,31.16058585805985"
    },
    "init_type": true,
    "map_style": "base",
    "data_alias": {},
    "geo_filter": [
      {
        "source": "customer",
        "filters": null,
        "packageId": 74,
        "object_type": "上海区县",
        "geometry_type": "polygon"
      }
    ],
    "refresh_time": 0,
    "static_cards": [],
    "supp_filters": [
      {
        "cols": [
          {
            "db": "int",
            "key": "换乘线路数",
            "h_type": "number",
            "h_value": "换乘线路数"
          },
          {
            "db": "str",
            "key": "是否换乘",
            "h_type": "text",
            "h_value": "是否换乘"
          },
          {
            "db": "str",
            "key": "线路",
            "h_type": "text",
            "h_value": "线路"
          }
        ],
        "source": "market",
        "packageId": 2125,
        "object_type": "上海地铁_站点流量_2018周末(数据中心)",
        "geometry_type": "point"
      },
      {
        "cols": [
          {
            "db": "int",
            "key": "平均消费",
            "h_type": "number",
            "h_value": "平均消费"
          },
          {
            "db": "str",
            "key": "等级",
            "list": [
              "五星商户",
              "准五星商户",
              "四星商户"
            ],
            "h_type": "text",
            "h_value": "等级"
          }
        ],
        "source": "market",
        "packageId": 1641,
        "object_type": "上海商业_餐饮客单价及点评(数据中心)",
        "geometry_type": "point"
      },
      {
        "source": "customer",
        "packageId": 80,
        "object_type": "上海市 幼儿园",
        "geometry_type": "point"
      }
    ],
    "buffer_filters": null,
    "is_server_render": true,
    "screening_method": "intersects",
    "current_geo_filter": {
      "source": "customer",
      "filters": [
        {
          "uid": "filter_48abb330-4408-11e9-b091-ef4b241f7f26",
          "style": {
            "color": "#00968E",
            "fillOpacity": 0,
            "strokeStyle": "solid",
            "strokeWeight": 1,
            "strokeOpacity": 1,
            "strokeDasharray": [
              0,
              0,
              0,
              0
            ]
          }
        }
      ],
      "packageId": 74,
      "object_type": "上海区县",
      "geometry_type": "polygon"
    },
    "is_card_default_open": false
  },
  "id": 37887,
  "name": "geo_8f3da650-4c69-11e9-b5b8-090a4c32fe29",
  "status": "normal",
  "update_time": "2019-03-22 14:13:24",
  "privs": [
    "modify",
    "update",
    "read",
    "delete"
  ]
};
