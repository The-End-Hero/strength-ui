import React, { Component } from "react";
import mix from "mix-with";
import map from "lodash/map";
import size from "lodash/size";
import cls from "classnames";

const radioStyle = {
  display: "block",
  height: "20px",
  lineHeight: "20px",
  color: "#fff"
};

interface IProps {
  geo_filters?: [],
  geo_filter?: {},
  polygonDataAll?: any,
  deleteGeoFilter():void,
}

class TopFilterGeoSelect extends Component<IProps, any> {
  static defaultProps = {
    geo_filters: [
      {
        "source": "customer",
        "current": true,
        "filters": [
          {
            "uid": "filter_2db8ec00-506a-11e9-82e3-e3300bfb957a",
            "style": {
              "color": "#00968e",
              "fillOpacity": 0
            }
          }
        ],
        "packageId": 1,
        "object_type": "长三角一体化", //包名称
        "geometry_type": "polygon"
      },
      {
        "source": "customer",
        "filters": null,
        "packageId": 11,
        "object_type": "街镇边界", // 包名称
        "geometry_type": "polygon"
      },
      {
        "source": "customer",
        "current": true,
        "filters": [
          {
            "uid": "filter_2f9685a0-506a-11e9-82e3-e3300bfb957a",
            "style": {
              "color": "#00968e",
              "fillOpacity": 0
            }
          }
        ],
        "packageId": 10,
        "object_type": "区县边界", // 包名称
        "geometry_type": "polygon"
      }
    ]
  };
  timeoutId: any;
  timeoutId2: any;

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showSub: false,
      currentGeoValue: ""
    };
    this.timeoutId = null;
  }

  changeShowMore = (bool) => () => {
    console.log(bool);
    this.setState({
      showMore: bool
    });
  };
  selectOption = (option) => () => {
    const { source, packageId, object_type, geometry_type } = option;
    console.log(option, "选中数据");


    this.changeShowMore(false)();
  };
  showMenu = () => {
    const { show } = this.state;
    clearTimeout(this.timeoutId);
    !show && this.setState({ show: true });
  };
  showMenu2 = () => {
    const { showSub } = this.state;
    clearTimeout(this.timeoutId2);
    !showSub && this.setState({ showSub: true });
  };
  onMouseLeave = () => {
    this.timeoutId = setTimeout(() => {
      this.setState({ show: false });
    }, 300);
  };
  onMouseLeave2 = () => {
    this.timeoutId2 = setTimeout(() => {
      this.setState({ showSub: false });
    }, 300);
  };
  onCurrentGeoValue = (e) => {
    console.log("radio checked", e.target.value);
    this.setState({
      currentGeoValue: e.target.value
    });
  };
  onChange = () => {

  };

  render() {
    const { showSub, show, newMapPolyonSelectkey } = this.state;
    const { polygonDataAll, geo_filters } = this.props;
    return (
      <div className="mc_map_geo_select_top" onMouseOver={this.showMenu}
           onMouseLeave={this.onMouseLeave}>
        <div
          className={cls("mc_map_geo_select_top_btn", { hidden: !size(geo_filters) && Array.isArray(geo_filters) })}>
          <div className="mc_map_geo_select_top_tit">
            地理选择
          </div>
          <i className="material-icons">&#xE5C5;</i>
        </div>
        <div className="mc_map_geo_select_top_menus_wrap" style={show ? { display: "block" } : {}}>
          <div className="mc_map_geo_select_top_menu"
               onMouseOver={this.showMenu2}
               onMouseLeave={this.onMouseLeave2}>

            {
              map(geo_filters, (current, index) => {
                const { object_type, geometry_type, source, packageId } = current;
                return (
                  <div className="mc_map_geo_select_top_menu_item"
                       key={source + geometry_type + packageId + object_type}>
                    <i className="material-icons">radio_button_checked</i>
                    <div className="mc_map_geo_select_top_menu_item_name">{object_type}</div>
                    <i className="material-icons">arrow_right</i>
                  </div>
                );
              })
            }
            {!!size(polygonDataAll) &&
            <div
              className={cls("mc_map_geo_select_top_sub_menu", { hidden: !newMapPolyonSelectkey })}
              style={showSub ? { display: "flex" } : {}}>
              <div className="lazy_list_top_search">
                <i className="material-icons">&#xE8B6;</i>
                <input onChange={this.onChange}
                       placeholder="搜索"/>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const MixTopFilterGeoSelect = TopFilterGeoSelect;// mix(TopFilterGeoSelect).with();
export default MixTopFilterGeoSelect;
