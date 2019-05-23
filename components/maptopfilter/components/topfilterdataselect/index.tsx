import React, { Component } from "react";
import mix from "mix-with";

import {map,size,filter,isObject} from 'lodash'
import cls from "classnames";
import Button from "@material-ui/core/Button";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import IconType from "../geotypesicon";

interface IProps {
  supper_filters?: [],
  supper_filter: {
    geometry_type?: string,
    object_type?: string,
    source?: string,
    packageId?: number
  },
  deleteSupperFilter():void
}

class TopFilterDataSelect extends Component<IProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false
    };
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

  render() {
    const { showMore } = this.state;
    const { supper_filters, supper_filter } = this.props;
    return (
      <div className={cls("mc_map_top_filter_data_select", { hidden: !size(supper_filters) })}>
        {
          size(supper_filter)>0 && isObject(supper_filter) &&
          <div className="mc_map_top_filter_data_select_item"
               onClick={this.changeShowMore(!showMore)}>
            <IconType type={supper_filter.geometry_type}/>
            <div>{supper_filter.object_type}</div>
          </div>
        }
        {
          showMore && map(supper_filters, (current) => {
            if (supper_filter && (current.object_type !== supper_filter.object_type ||
              current.packageId !== supper_filter.packageId ||
              current.source !== supper_filter.source)) {
              return (
                <div className="mc_map_top_filter_data_select_item"
                     key={current.object_type}
                     onClick={this.selectOption(current)}
                >
                  <IconType type={current.geometry_type}/>
                  <div>{current.object_type}</div>
                </div>
              );
            } else return null;
          })
        }
      </div>
    );
  }
}

const MixTopFilterDataSelect = TopFilterDataSelect;//mix(TopFilterDataSelect).with();
export default MixTopFilterDataSelect;
