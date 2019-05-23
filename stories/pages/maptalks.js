import React, { Component } from "react";
import Maptalks from "../../components/maptalks";
import {
  data
} from "../../mapMockData/origindata";

export default class MapTalksPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      Authorization: ""
    };
    this.maptalks = null;
    this.timeId = null;
  }

  componentDidMount() {
  }

  changeData = e => {
    console.log(e.target.id);
    const id = e.target.id;
    let data = data;
    // if (id === "heatmap") {
    //   data = point2;
    // } else if (id === "base") {
    //   data = point1;
    // } else if (id === "polygon") {
    //   data = polygon;
    // } else if (id === "manypoint") {
    //   data = manypoint;
    // }
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
    this.maptalks.turnOnRangingTool();
  };
  setAmapRef = ele => {
    this.maptalks = ele;
  };

  saveAsJpeg = () => {
    this.maptalks.saveAsJpeg();
  };
  changeAuthorization = (e) => {
    clearTimeout(this.timeId);
    const val = e.target.value;
    this.setState({ Authorization: val });
    console.log(val);
    this.timeId = setTimeout(() => {

    }, 300);
  };

  render() {
    const { data, Authorization } = this.state;
    console.log(data, "数据集");
    return (
      <div>
        <div>
          Authorization:
          <input type="text" value={Authorization} onChange={this.changeAuthorization}/>
        </div>
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
          <Maptalks
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
