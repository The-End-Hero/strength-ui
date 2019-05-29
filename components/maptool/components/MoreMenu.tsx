import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { map, size } from "lodash";

export default class Button extends PureComponent<any, any> {

  static defaultProps = {
    already_rendered: 2,
    list: [
      { key: "polygon_select", label: "画多边形", checked: true },
      { key: "diameter_select", label: "画圆", checked: true },
      { key: "delete_draw", label: "清空围栏", checked: true },
      { key: "map_style", label: "地图样式", checked: true },
      { key: "full_screen", label: "地图全屏", checked: true },
      { key: "save_as_jpeg", label: "地图截屏", checked: true },
      { key: "street_view", label: "街景", checked: true },
      { key: "ranging", label: "测距", checked: true },
      { key: "reset_map", label: "还原地图", checked: false }
    ]
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
    const { changeCollapse, changeMoreMenu, list, already_rendered } = this.props;

    const offset_buttom = -10 - (36 * (size(list) - 3));
    return (
      <div className="mc_map_tool_more" style={{ bottom: offset_buttom }}
           onMouseEnter={this.enter}
           onMouseLeave={this.leave}>
        {
          map(list, (l) => {
            return (
              <div className="mc_map_tool_more_li">
                <div className={`mc_map_tool_more_li_icon ${l.key}`}></div>
                {l.label}
              </div>
            );
          })
        }
        <div className="mc_map_tool_more_line"></div>
        <div className="mc_map_tool_more_li" onClick={() => {
          changeCollapse && changeCollapse(true);
          changeMoreMenu && changeMoreMenu(false);
        }}>收起工具栏
        </div>
      </div>
    );
  }
}
