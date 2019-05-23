import React, { Component } from "react";
import mix from "mix-with";
import cls from "classnames";
import Button from "@material-ui/core/Button";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { map, isEqual, size, find ,get} from "lodash";
import { Menu, Dropdown } from "antd";
import DrawItem from "../drawitem";
// import Menu from 'antd/lib/menu'
// import 'antd/lib/menu/style/index.css'
// import Dropdown from 'antd/lib/dropdown'
// import 'antd/lib/dropdown/style/index.css'

interface IProps {
  supper_filters?: [],
  supper_filter?: any|{},
  geo_filters?: [],
  geo_filter?: {},
  loading?: boolean,
  changeMoreFilter: any,

  onSearch?(): void,

  settingRender?(): React.ElementType // draw配置项
  deleteGeoFilter(one: any): void,

  deleteSupperFilter(one: any): void,

  selectSupperFilter(one: any): void,

  selectGeoFilter(one: any): void,

  columnTypes: any,
  reset():void
}

class TopFilterMoreFilter extends Component<IProps, any> {
  menu: any;
  draw: any;

  constructor(props) {
    super(props);
    this.state = {
      showMoreFilter: false,
      showDrawer: false
    };
  }

  toggleDrawer = (bool) => () => {
    console.log("onClickAway");
    this.setState({
      showDrawer: bool
    });
  };


  onAddFilterCol = (one, two) => {

  };
  resetTemp = () => {

  };
  setDragData = (one, two) => {

  };

  render() {
    const {
      changeMoreFilter, supper_filters, supper_filter, geo_filters, geo_filter, settingRender,
      deleteSupperFilter, deleteGeoFilter, selectSupperFilter, selectGeoFilter, columnTypes,
      reset
    } = this.props;
    console.log(this.props, "props---topfiltermorefilter");
    const { source, packageId, object_type, geometry_type } = supper_filter;
    const col = get(columnTypes, `${source}.${geometry_type}.${object_type}.${packageId}`);
    // TODO 搜索
    console.log(columnTypes, "columnTypes");
    return (
      <div className='mc_map_top_filter_more_filter'>
        <div>
          <div>将要分析的系统</div>
          <div className="mc_map_top_filter_more_filter_data">
            <div className="mc_map_top_filter_more_filter_data_placeholder">将需要分析的数据拖拽至此处</div>
            {
              map(supper_filters, (current) => {
                // const {object_type,source,packageId,geometry_type} = current
                // const {object_type,source,packageId,geometry_type} = supper_filter
                const isSelect = isEqual(current, supper_filter);
                return (
                  <div key={current.object_type}
                       className={cls("mc_map_top_filter_more_filter_data_item", { isSelect })}>
                    <div onClick={() => {
                      selectSupperFilter(current);
                    }}>{current.object_type}</div>
                    <i className="material-icons" onClick={() => {
                      deleteSupperFilter(current);
                    }}>clear</i>
                  </div>
                );
              })
            }
          </div>
        </div>
        {
          columnTypes && size(columnTypes) > 0 && supper_filter && size(supper_filter) > 0 &&
          <div className="map_analysis_top_filter_setting_cols">
            {map(col, (col, index) => {
              // let found = find(fdFilter.cols, t => t.key == col.key);
              return (
                <DrawItem key={col.key} index={index} item={col}
                          type={col.h_type} label={`${col.h_value}`}
                          showAdd
                          onAdd={e => this.onAddFilterCol(e, col)}
                          onDragEnd={this.resetTemp}
                          onDragStart={(e) => this.setDragData(e, col)}
                />
              );
            })}
          </div>
        }
        <div>
          <div style={{ paddingTop: 10 }}>筛选围栏</div>
          <div className="mc_map_top_filter_more_filter_geo">
            <div className="mc_map_top_filter_more_filter_geo_placeholder">将围栏数据拖拽至此处</div>
            {
              map(geo_filters, (current) => {
                const isSelect = isEqual(current, geo_filter);
                return (
                  <div key={current.object_type}
                       className={cls("mc_map_top_filter_more_filter_geo_item", { isSelect })}>
                    <div onClick={() => {
                      selectGeoFilter(current);
                    }}>{current.object_type}</div>
                    <i className="material-icons" onClick={() => {
                      deleteGeoFilter(current);
                    }}>clear</i>
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="mc_map_top_filter_more_filter_setting_btn">
          <div className="mc_map_top_filter_more_filter_setting_btn_setting">
            <i className="material-icons" onClick={this.toggleDrawer(true)}>settings</i>
          </div>
          <div className="mc_map_top_filter_more_filter_setting_btn_remove" onClick={reset}>清空</div>
          <div className="mc_map_top_filter_more_filter_setting_btn_confirm" onClick={changeMoreFilter}>确定</div>
        </div>

        <Drawer anchor="right" open={this.state.showDrawer}>
          <div className="mc_map_top_filter_more_filter_setting_drawer" ref={ref => this.draw = ref}>
            {settingRender && settingRender()}
            <div>
              <div onClick={this.toggleDrawer(false)}>确定</div>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

const MixTopFilterMoreFilter = TopFilterMoreFilter;//mix(TopFilterMoreFilter).with();
export default MixTopFilterMoreFilter;
