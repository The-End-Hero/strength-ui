import forEach from "lodash/forEach";
import get from "lodash/get";

const RemoveMixin = (superclass) => class RemoveMixin extends superclass {
  removeLayer = (layer) => {
    if (layer) layer.destroy();
    layer = null;
  };

  removeLayerOrHeatMap = (card_id, filter_id, from_to) => {
    const massMarks = get(this.massMarkers, `${card_id}.${filter_id}`);//this.massMarkers && this.massMarkers[card_id] && this.massMarkers[card_id][filter_id];
    if (massMarks) {
      this.removeLayer(massMarks);
      this.massMarkers[card_id][filter_id] = null;
    }
    // 多地理下的marker存储
    const multMassMarkers = get(this.multMassMarkers, `${card_id}.${filter_id}.${from_to}`);//this.multMassMarkers && this.multMassMarkers[card_id] && this.multMassMarkers[card_id][filter_id] && this.multMassMarkers[card_id][filter_id][from_to];
    if (multMassMarkers && from_to) {
      this.removeLayer(multMassMarkers);
      this.multMassMarkers[card_id][filter_id][from_to] = null;
    }

    // 多地理下的heat存储
    const multHeatMaps = get(this.multHeatMaps, `${card_id}.${filter_id}.${from_to}`);//this.multHeatMaps && this.multHeatMaps[card_id] && this.multHeatMaps[card_id][filter_id] && this.multHeatMaps[card_id][filter_id][from_to];
    if (multHeatMaps) {
      if (this.multHeatMaps[card_id][filter_id][from_to].destroy) {
        this.multHeatMaps[card_id][filter_id][from_to].destroy();
      }
      if (this.map) this.map.remove(this.multHeatMaps[card_id][filter_id][from_to]);
      this.multHeatMaps[card_id][filter_id][from_to] = null;
    }

    const heatMap = get(this.heatMaps, `${card_id}.${filter_id}`);//this.heatMaps && this.heatMaps[card_id] && this.heatMaps[card_id][filter_id];
    if (heatMap) {
      if (this.heatMaps[card_id][filter_id].destroy) {
        this.heatMaps[card_id][filter_id].destroy();
      }
      if (this.map) this.map.remove(this.heatMaps[card_id][filter_id]);
      this.heatMaps[card_id][filter_id] = null;
    }
  };

  clearLayers = () => { // 清除图层
    console.log("清除图层");
    forEach(this.massMarkers, (c, card_id) => {
      this.removeDataOnMapCard(card_id);
    });
    forEach(this.heatMaps, (c, card_id) => {
      this.removeDataOnMapCard(card_id);
    });
    forEach(this.polygonLayers, (c, card_id) => {
      this.removeDataOnMapCard(card_id);
    });
    forEach(this.lineLayers, (c, card_id) => {
      this.removeDataOnMapCard(card_id);
    });
  };

  removeDataOnMapCard = (card_id) => {
    // 多地理 marker
    forEach(this.multMassMarkers[card_id], (t, filter_id) => {
      this.removeLayer(this.multMassMarkers[card_id][filter_id]["to"]);
      this.removeLayer(this.multMassMarkers[card_id][filter_id]["from"]);
      delete this.multMassMarkers[card_id][filter_id];
    });
    forEach(this.massMarkers[card_id], (t, filter_id) => {
      this.removeLayer(this.massMarkers[card_id][filter_id]);
      delete this.massMarkers[card_id][filter_id];
    });
    // 多地理 heat
    forEach(this.multHeatMaps[card_id], (t, filter_id) => {
      this.removeLayerOrHeatMap(card_id, filter_id, "to");
      this.removeLayerOrHeatMap(card_id, filter_id, "from");
      delete this.multHeatMaps[card_id][filter_id]["from"];
      delete this.multHeatMaps[card_id][filter_id]["to"];
    });
    forEach(this.heatMaps[card_id], (t, filter_id) => {
      this.removeLayerOrHeatMap(card_id, filter_id);
      delete this.heatMaps[card_id][filter_id];
    });
    forEach(this.polygonLayers[card_id], (t, filter_id) => {
      let layersMap = this.polygonLayers[card_id][filter_id];
      let layers = [];
      forEach(layersMap, t => {
        if (t) layers = layers.concat(t);
      });
      if (this.map && layers) this.map.remove(layers);
      delete this.polygonLayers[card_id][filter_id];
    });
    forEach(this.lineLayers[card_id], (t, filter_id) => {
      let layersMap = this.lineLayers[card_id][filter_id];
      let layers = [];
      forEach(layersMap, t => {
        if (t) layers = layers.concat(t);
      });
      if (this.map && layers) this.map.remove(layers);
      delete this.lineLayers[card_id][filter_id];
    });
  };


  /**
   * 清空地图所有layers
   * @param withBuffer
   * @returns {Promise<void>}
   */
  clearMap = async (withBuffer = true) => {
    let mapIns = this.map;
    if (this.helpTip && mapIns) mapIns.remove(this.helpTip.helpTooltip);
    this.helpTip = null;
    // this.clearLayers()
    const { cards } = this.props;
    cards.map((current) => { // 仅对cards内部进行清除
      this.clearLayerJustByCards(current.uid);
    });
    // this.clearOverlays();// 为毛清空了圆和自定义多边形
    if (mapIns) {
      forEach(this.layers, (fp, source) => {
        forEach(fp, (fo, packageId) => {
          forEach(fo, (t, object_type) => {
            forEach(t, r => {
              mapIns.remove(r);
            });
          });
        });
      });
      forEach(this.point_to_polygon_markers, (fp, source) => {
        forEach(fp, (fo, packageId) => {
          forEach(fo, (t, object_type) => {
            this.removeLayer(t);
          });
        });
      });
      forEach(this.point_to_polygon_markers_active, (fp, source) => {
        forEach(fp, (fo, packageId) => {
          forEach(fo, (t, object_type) => {
            this.removeLayer(t);
          });
        });
      });
    }
    this.layers = {};
    this.point_to_polygon_markers = {};
    this.point_to_polygon_markers_active = {};
    if (withBuffer) this.clearBuffer();
  };

  // 清除buffer
  clearBuffer = () => {
    let mapIns = this.map;
    forEach(this.buffers, (c, card_id) => {
      forEach(c, (b, filter_id) => {
        mapIns.remove(b);
      });
    });
    this.buffers = {};
    this.buffersData = {};
  };

  clearLayerJustByCards = (id) => {
    // 多地理 点位
    forEach(this.multMassMarkers, (c, card_id) => {
      if (card_id === id) {
        this.removeDataOnMapCard(card_id);
      }
    });
    forEach(this.multHeatMaps, (c, card_id) => {
      if (card_id === id) {
        this.removeDataOnMapCard(card_id);
      }
    });
    forEach(this.massMarkers, (c, card_id) => {
      if (card_id === id) {
        this.removeDataOnMapCard(card_id);
      }
    });
    forEach(this.heatMaps, (c, card_id) => {
      if (card_id === id) {
        this.removeDataOnMapCard(card_id);
      }
    });
    forEach(this.polygonLayers, (c, card_id) => {
      if (card_id === id) {
        this.removeDataOnMapCard(card_id);
      }
    });
    forEach(this.lineLayers, (c, card_id) => {
      if (card_id === id) {
        this.removeDataOnMapCard(card_id);
      }
    });
    // console.log(this.massMarkers, 'this.massMarkers')
    // console.log(this.heatMaps,'this.heatMaps')
    // console.log(this.polygonLayers,'this.polygonLayers')
    // console.log(this.lineLayers,'this.lineLayers')
    // console.log(this.state.cards,'this.state.cards')
  };

  removeDataOnMapFilter = (card_id, filter_id) => {
    // console.log(this.multMassMarkers), 'multMassMarkers'
    // console.log(this.lineLayers, 'lineLayers')
    // 多地理 marker
    if (this.multMassMarkers && this.multMassMarkers[card_id] && this.multMassMarkers[card_id][filter_id]) {
      this.removeLayer(this.multMassMarkers[card_id][filter_id]["from"]);
      this.removeLayer(this.multMassMarkers[card_id][filter_id]["to"]);
      delete this.multMassMarkers[card_id][filter_id]["to"];
      delete this.multMassMarkers[card_id][filter_id]["from"];
    }
    if (this.massMarkers && this.massMarkers[card_id]) {
      this.removeLayer(this.massMarkers[card_id][filter_id]);
      delete this.massMarkers[card_id][filter_id];
    }
    if (this.heatMaps && this.heatMaps[card_id]) {
      this.removeLayerOrHeatMap(card_id, filter_id);
      delete this.heatMaps[card_id][filter_id];
    }
    if (this.polygonLayers && this.polygonLayers[card_id]) {
      let layersMap = this.polygonLayers[card_id][filter_id];
      let layers = [];
      forEach(layersMap, t => {
        if (t) (layers = layers.concat(t));
      });
      if (this.map && layers) this.map.remove(layers);
      delete this.polygonLayers[card_id][filter_id];
    }
    if (this.lineLayers && this.lineLayers[card_id]) {
      let layersMap = this.lineLayers[card_id][filter_id];
      let lines = [];
      forEach(layersMap, t => {
        if (t) (lines = lines.concat(t));
      });
      if (this.map && lines) this.map.remove(lines);
      delete this.lineLayers[card_id][filter_id];
    }
  };

};
export default RemoveMixin;
