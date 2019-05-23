import React, { Component } from "react";
import mix from "mix-with";
import cls from "classnames";
import { find } from "lodash";
import Button from "@material-ui/core/Button";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "@material-ui/core/styles";
import TopFilterMoreFilter from "./components/topfiltermorefilter";
import TopFilterDataSelect from "./components/topfilterdataselect";
import TopFilterGeoSelect from "./components/topfiltergeoselect";
// import Select, { Option, OptGroup } from "rc-select";
// import "rc-select/assets/index.css";
import $ from "jquery";
import PropTypes from "prop-types";


const StyledButton = withStyles({
  root: {
    background: "#49598A",
    border: 0,
    color: "white",
    height: 36,
    padding: "0 30px",
    boxShadow: "unset",
    borderRadius: 0,
    "&:hover": {
      background: "#38497B"
    }
  },
  label: {
    textTransform: "capitalize"
  }
})(Button);
const StyledIconButton = withStyles({
  root: {
    background: "unset",
    border: 0,
    color: "white",
    height: 36,
    width: 36,
    boxShadow: "unset",
    borderRadius: 0,
    padding: 0
  },
  label: {
    textTransform: "capitalize"
  }
})(IconButton);

interface IProps {
  supper_filters?: [],
  supper_filter: {},
  geo_filters?: [],
  geo_filter: {},
  loading?: boolean,

  settingRender?(): React.ElementType, // draw配置项
  onSearch?(): void,

  has_global_filter?: boolean, // 如果有  独立的全局筛选器
  deleteSupperFilter(): void,

  selectSupperFilter(): void,

  deleteGeoFilter(): void,

  selectGeoFilter(): void,

  columnTypes: any, // 数据字段
  
  addFilterCol():void, // 添加全局筛选器字段

  replaceAli():void, // 全局筛选器确认，改变supp_filters
  
  reset ():void, // 重置topfilter
  
}

class MapTopFilter extends Component<IProps, any> {
  static propTypes = {
    supper_filters: PropTypes.array.isRequired, // 所有查询数据
    supper_filter: PropTypes.object.isRequired, // 当前数据
    geo_filters: PropTypes.array.isRequired, // 所有围栏
    geo_filter: PropTypes.object.isRequired, // 当前围栏
    changeInitType: PropTypes.func.isRequired, // 改变初始化数据
    init_type: PropTypes.bool.isRequired, // 初始化数据
    changeCardDefault: PropTypes.func.isRequired, // 改变卡片是否展开
    is_card_default_open: PropTypes.bool.isRequired, // 卡片是否展开
    changeScreeningMethod: PropTypes.func.isRequired, // 改变地图围栏筛选方式
    screening_method: PropTypes.string.isRequired, // 地图围栏筛选方式
    changeRefreshTime: PropTypes.func.isRequired, // 改变地图自动刷新时间
    refresh_time: PropTypes.number.isRequired // 刷新时间间隔
  };
  static defaultProps = {
    supper_filters: [ // 全部查询数据
      {
        "cols": null,
        "source": "customer",
        "packageId": 19,
        "object_type": "绿地",
        "geometry_type": "polygon"
      },
      {
        "source": "customer",
        "packageId": 20,
        "object_type": "核心区各类指标",
        "geometry_type": "polygon"
      },
      {
        "source": "market",
        "packageId": 2580,
        "object_type": "长三角_水系",
        "geometry_type": "polygon"
      },
      {
        "source": "customer",
        "packageId": 1,
        "object_type": "长三角一体化",
        "geometry_type": "polygon"
      }
    ],
    supper_filter: {//当前查询数据
      "source": "customer",
      "packageId": 1,
      "object_type": "长三角一体化",
      "geometry_type": "polygon"
    },
    geo_filters: [ //全部围栏数据
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
    ],
    geo_filter: {
      "source": "customer",
      "filters": null,
      "packageId": 11,
      "object_type": "街镇边界", // 包名称
      "geometry_type": "polygon"
    },
    changeInitType: () => {
    }, // 修改init_type
    init_type: false,
    changeCardDefault: () => {
    }, // 修改卡片默认是否展开
    is_card_default_open: false,
    changeScreeningMethod: () => {
    }, // 修改围栏查询边界设置
    screening_method: "intersects",// intersects | intersects_no_touches

    changeRefreshTime: () => {
    }, // 自动刷新时间
    refresh_time: 0,
    has_global_filter: false
  };
  topFilterMoreFilter: any;

  constructor(props) {
    super(props);
    this.state = {
      showMoreFilter: false,
      supp_filters: [],
      select_filter: {}
    };
  }

  changeMoreFilter = () => {
    const { showMoreFilter } = this.state;
    this.setState({
      showMoreFilter: !showMoreFilter
    });
  };

  closeTopFilterMoreFilter = () => {
    console.log("onClickAway");
    if (this.topFilterMoreFilter.state.showDrawer) {
      return;
    }
    this.setState({ showMoreFilter: false });
  };
  selectData = (value) => {
    console.log(value);
  };

  render() {
    const { showMoreFilter } = this.state;
    const { onSearch, has_global_filter, deleteSupperFilter, deleteGeoFilter } = this.props;
    const {
      supper_filters, supper_filter, geo_filters, geo_filter, loading
    } = this.props;
    return (
      <div className={cls("mc_map_top_filter")}>
        {/*<CascadingHoverMenus></CascadingHoverMenus>*/}
        <TopFilterGeoSelect
          geo_filters={geo_filters}
          geo_filter={geo_filter}
          deleteGeoFilter={deleteGeoFilter}
        />
        {
          !has_global_filter &&
          <TopFilterDataSelect
            supper_filters={supper_filters}
            supper_filter={supper_filter}
            deleteSupperFilter={deleteSupperFilter}
          />
        }

        <div style={{ flex: 1 }}></div>
        <StyledButton variant="contained" color="primary" onClick={onSearch}>
          {!loading ? "开始分析" : "分析中..."}
        </StyledButton>
        <StyledIconButton onClick={this.changeMoreFilter}>
          {
            showMoreFilter ? <ExpandLess fontSize="small"/> : <ExpandMore fontSize="small"/>
          }
        </StyledIconButton>
        {
          showMoreFilter &&
          <TopFilterMoreFilter
            ref={ref => this.topFilterMoreFilter = ref}
            changeMoreFilter={this.changeMoreFilter}
            {...this.props}
          />
        }
      </div>
    );
  }
}

const MixMapTopFilter = MapTopFilter;// mix(MapTopFilter).with()
export default MixMapTopFilter;
