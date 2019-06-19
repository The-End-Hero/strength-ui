import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cls from "classnames";
import { SearchIcon, WarningIcon } from "../icon";
import { CheckBoxIcon } from "../icon";

export default class CheckBox extends PureComponent<any, any> {
  static defaultProps = {};
  static propTypes = {};


  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = () => {
    const { onChange, checked } = this.props;
    onChange && onChange(!checked);
  };

  render() {
    const {
      checked,
      label,
      tips,
      style,
      className,
      CheckedIcon,
      UnCheckedIcon
    } = this.props;
    let checkbox = (
      <div className={`mc_checkbox ${className ? className : ""}`} style={style}>
        <div className="mc_checkbox_main" onClick={this.onChange}>
          <div className="mc_checkbox_font">
            {
              checked ?
                (CheckedIcon || <CheckBoxIcon type="CHECKED"/>) :
                (UnCheckedIcon || <CheckBoxIcon type="UNCHECKED"/>)
            }
          </div>
          <div>
            <div>{label}</div>
          </div>
        </div>
        {
          tips &&
          <div className="mc_checkbox_tips">{tips}</div>
        }
      </div>


    );
    return checkbox;
  }
}
