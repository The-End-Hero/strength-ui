import * as React from "react";

class Custom_control {
  _map: any;
  _container: any;
  _resetDom: any;
  _upZoomDom: any;
  _downZoomDom: any;
  _zoomDisplayDom: any;

  onAdd = (map) => {
    console.log(map, "map");
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl mc_map_mapbox_min_max_reset";
    this._container.style.color = "white";
    // reset
    this._resetDom = document.createElement("div");
    this._resetDom.innerHTML = '<i class="material-icons">replay</i>';
    this._resetDom.onclick = () => {
      // this._map.setBearing(0)
      // this._map.setPitch(0)
      this._map.easeTo({
        bearing:0,pitch:0,
        easing: this.easing
      })
    };

    
    // zoom display
    this._zoomDisplayDom = document.createElement("div");
    this._zoomDisplayDom.style.marginTop = '6px';
    this._zoomDisplayDom.innerHTML = this._map.getZoom();
    this._map.on('zoomend',()=>{
      this._zoomDisplayDom.innerHTML = Math.round(this._map.getZoom());
    })
    
    // upzoom
    this._upZoomDom = document.createElement("div");
    this._upZoomDom.style.marginTop = '6px';
    this._upZoomDom.innerHTML = '<i class="material-icons">add</i>';
    this._upZoomDom.onclick = () => {
      this._map.setZoom(Math.round(this._map.getZoom()) + 1);
    };
    
    // downzoom
    this._downZoomDom = document.createElement("div");
    this._downZoomDom.innerHTML = '<i class="material-icons">remove</i>';
    this._downZoomDom.onclick = () => {
      this._map.setZoom(Math.round(this._map.getZoom()) - 1);
    };


    this._container.appendChild(this._resetDom);
    this._container.appendChild(this._zoomDisplayDom);
    this._container.appendChild(this._upZoomDom);
    this._container.appendChild(this._downZoomDom);
    return this._container;
  }
  easing = (t) => {
    return t * (2 - t);
  };
  
  onRemove = () => {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  };
};

export default Custom_control;

