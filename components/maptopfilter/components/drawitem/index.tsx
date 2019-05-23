import * as React from "react";
import cls from "classnames";
import { iconMap } from "../../../../constants/Constants";

class DrawItem extends React.PureComponent<any,any> {

  static defaultProps = {
    draggable: true
  };

  render() {
    let {
      draggable, onDragStart, onDragEnd, index,
      item, showIcon, iconClick, type, label, wrapperCls, showAdd, onAdd, found
    } = this.props;
    return (
      <div className={cls("draw_item", wrapperCls, { found })}
           draggable={draggable}
           onDragStart={e => onDragStart && onDragStart(e, item, index)}
           onDragEnd={e => onDragEnd && onDragEnd(e, item, index)}
           onClick={e => iconClick && iconClick(e, item, index)}>
                <span className="colHeader">
                    <span className={`${type}_bg color_bg`}/>
                    <i className="material-icons">{iconMap[type]}</i>
                    <span className="name">{label}</span>
                  {
                    showIcon && (
                      <i className="material-icons">
                        keyboard_arrow_down
                      </i>
                    )
                  }
                </span>
        <div className="edit_wrapper" draggable={false}/>
        {showAdd &&
        <div className="draw_item_add_btn"
             onClick={onAdd}>
          {!found ?
            <i className="material-icons">&#xE145;</i>
            : <i className="material-icons">&#xE15B;</i>
          }
        </div>
        }
      </div>
    );
  }
}

export default DrawItem;
