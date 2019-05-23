import React, { Component } from "react";
import Amap from "../../components/amap";
import {
  polygon,
  point1,
  point2,
  manypoint
} from "../../components/amap/testData/testData";

export default class AmapPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: polygon
    };
    this.amap = null;
  }

  componentDidMount() {
  }

  changeData = e => {
    console.log(e.target.id);
    const id = e.target.id;
    let data = point1;
    if (id === "heatmap") {
      data = point2;
    } else if (id === "base") {
      data = point1;
    } else if (id === "polygon") {
      data = polygon;
    } else if (id === "manypoint") {
      data = manypoint;
    }
    this.setState({
      data
    });
  };

  changeMapStyle = e => {
    const key = e.target.getAttribute("data-key");
    console.log(key);
    const { data } = this.state;
    data.map_style = key;
    this.setState({
      data
    });
  };
  turnOnRangingTool = fn => {
    this.amap.turnOnRangingTool();
  };
  setAmapRef = ele => {
    this.amap = ele;
  };

  saveAsJpeg = () => {
    this.amap.saveAsJpeg();
  };

  render() {
    const { data } = this.state;
    console.log(data, "数据集");
    return (
      <div>
        <div>
          <button onClick={this.changeData} id="base">
            基本使用
          </button>
          <button onClick={this.changeData} id="heatmap">
            热力
          </button>
          <button onClick={this.changeData} id="polygon">
            面数据
          </button>
          <button onClick={this.changeData} id="manypoint">
            复杂点数据
          </button>
        </div>
        <div>
          <button onClick={this.changeMapStyle} data-key="base">
            默认
          </button>
          <button onClick={this.changeMapStyle} data-key="normal">
            浅色
          </button>
          <button onClick={this.changeMapStyle} data-key="wxt">
            卫星
          </button>
        </div>
        <div>
          <button>点选</button>
          <button>画圆</button>
          <button>画多边形</button>
        </div>
        <div>
          <button onClick={this.turnOnRangingTool}>测距</button>
          <button onClick={this.saveAsJpeg}>截图</button>
        </div>
        <div style={{ width: 1200, height: 500, backgroundColor: "red" }}>
          <Amap
            ref={this.setAmapRef}
            is_static_map={false}
            current_geo_filter={data.current_geo_filter}
            map_style={data.map_style}
            map_state={data.mapState}
            cards={data.cards}
            static_cards={data.static_cards}
            active_layer_ids={data.active_layer_ids}
            active_layer_ids_for_static_cards={
              data.active_layer_ids_for_static_cards
            }
          />
        </div>
      </div>
    );
  }
}
