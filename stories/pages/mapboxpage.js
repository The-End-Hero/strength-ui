import React, { Component } from "react";

// const MapBox: any = React.lazy(() => import("../../components/mapbox"));

import MapBox from "../../components/mapbox";
import {
  data
} from "../../mapMockData/origindata";


class MapBoxPage extends Component {
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
    let data = this.state.data;
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
    console.log(data, "数据集1212");
    console.log(MapBox, "MapBox");
    return (
      <div>
        <div style={{ width: 1200, height: 500, backgroundColor: "gray" }}>
          <MapBox
            ref={this.setAmapRef}
            map_style="base"
          />
        </div>
      </div>
    );
  }
}

export default MapBoxPage;
