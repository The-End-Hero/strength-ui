import React, { Component } from "react";
import Amap from "../../../components/amap";
import {
  polygon,
  point1,
  point2,
  manypoint
} from "../../../components/amap/testData/testData";
import MapCards from "../../../components/mapcards";
import MapTool from "../../../components/maptool";

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

  renderMapTool = (props) => {
    const {
      is_server_render,
      onFullScreenCenter,
      fullscreencenter,
      selectMapStyle,
      saveAsJpeg,
      turnOnRangingTool,
      pauseState,
      selfSelect,
      disSelect,
      emptySelect,
      mapStyle,
      hasCustomDraw,
      mapState
    } = props
    return (<div style={{ position: "absolute", top: 0, paddingTop: 36 }}>
      <MapTool
        is_server_render={is_server_render}
        onFullScreenCenter={onFullScreenCenter}
        fullscreencenter={fullscreencenter}
        selectMapStyle={selectMapStyle}
        saveAsJpeg={saveAsJpeg}
        turnOnRangingTool={turnOnRangingTool}
        pauseState={pauseState}
        selfSelect={selfSelect}
        disSelect={disSelect}
        emptySelect={emptySelect}
        mapStyle={mapStyle}
        hasCustomDraw={hasCustomDraw}
        mapState={mapState}
      />
    </div>);
  };
  renderMapCards=()=>{
    
    return(
      <MapCards/>
    )
  }
  render() {
    const { data } = this.state;
    console.log(data, "数据集");
    return (
      <div>

        <div style={{ width: 1200, height: 500, backgroundColor: "#ddd" }}>
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
            renderMapTool={this.renderMapTool}
            renderMapCards={this.renderMapCards}
          />
        </div>
      </div>
    );
  }
}
