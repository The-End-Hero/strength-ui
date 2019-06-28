import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { map, size, filter } from "lodash";

export default class Button extends PureComponent<any, any> {

  static defaultProps = {
    already_rendered: 2
  };
  timeId: any;

  constructor(props) {
    super(props);
    this.state = {};
    this.timeId = null;
  }

  enter = () => {
    this.timeId && clearTimeout(this.timeId);
  };
  leave = () => {
    const { changeMoreMenu } = this.props;
    this.timeId = setTimeout(() => {
      changeMoreMenu && changeMoreMenu(false);
    }, 500);
  };


  render() {
    const { changeCollapse, changeMoreMenu, already_rendered, menuClick, maptools, style } = this.props;
    const list = filter(maptools, (t) => {
      return (t.fold === true && t.checked);
    });
    const offset_buttom = -15//-10 - (36 * (size(list) - 3));
    return (
      <div className="mc_map_tool_more" style={{ bottom: offset_buttom, ...style }}
           onMouseEnter={this.enter}
           onMouseLeave={this.leave}>
        {
          map(list, (l) => {
            return (
              <div className="mc_map_tool_more_li" onClick={() => {
                menuClick(l.key);
              }}>
                <div className={`mc_map_tool_more_li_icon ${l.key}`}></div>
                {l.label}
              </div>
            );
          })
        }
        {
          size(list) > 0 &&
          <div className="mc_map_tool_more_line"></div>
        }
        <div className="mc_map_tool_more_li" onClick={() => {
          changeCollapse && changeCollapse(true);
          changeMoreMenu && changeMoreMenu(false);
        }}>收起工具栏
        </div>
      </div>
    );
  }
}
