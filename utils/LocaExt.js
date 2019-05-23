import get from "lodash/get";
import forEach from "lodash/forEach";
import indexOf from "lodash/indexOf";
import find from "lodash/find";
import size from "lodash/size";

function getData() {
  return this._dataSet._data;
}

function getMarkerStyleById(id) {
  if (!this._markerGroup) return {};
  let overlays = this._markerGroup._overlays;
  let data = find(overlays, e => e._data.id == id);
  if (!data) return;
  return data._options.style;
}

function render() {
  let t = this
    , e = this._options
    , n = e["lnglat"]
    , r = e["invisible"]
    , i = e["type"]
    , fitView = e["fitView"]
    , a = e["blendMode"]
    , u = e["opacity"];
  if (!n)
    throw new Error("Set lnglat column name, first!");
  this._whenReady(function() {
    let _visualconf = t._visualconf;
    let _size_visual = t._size_visual;
    let { domain, deps, range, visualize_type } = _visualconf || {};
    let __other_idx__ = indexOf(domain, "__other__");
    for (var e = t._dataSet.getData(n), c = [], f = -1, s = e.length, l = t._normalizedList; ++f < s;) {
      let h = t._dataSet.getRow(f);

      let lnglat = e[f];
      let style = { ...l.style };
      if (_visualconf) {
        let idx = -1;
        let val = get(h, deps);
        if (visualize_type == 1) { // 数值可视化
          forEach(domain, (t, dix) => { // domain为数值分段
            if (dix == 0 && t === val) {
              idx = dix;
              return false;
            }
            if (val <= t) {
              idx = dix - 1;
              return false;
            }
          });
          // if (idx == -1) idx = 0;
          style.color = range[idx] || "transparent";

        } else if (visualize_type == 2) { // 分类可视化
          forEach(domain, (t, dix) => { // domain为类型字段分类
            if (val === t) {
              idx = dix;
              return false;
            }
          });
          style.color = idx !== -1 ? range[idx] : range[__other_idx__];
        }
      }
      // 大小可视化
      if (size(_size_visual)) {
        const { key, size_range, key_range } = _size_visual || {};
        const field = get(h, `extra.${key}`);// 对应字段值
        const size = (size_range[1] - size_range[0]) / (key_range[1] - key_range[0]) * (field - key_range[0]) + size_range[0];
        style.size = size;
      }
      let marker = new Loca.MapMarker(h, {
        type: i,
        position: function() {
          return lnglat.split(",");
        },
        style: style
      });
      ["click", "dblclick", "contextmenu", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave"].forEach(function(e) {
        marker.on(e, function(n) {
          let r = n.originalData.event
            , i = n.target
            , o = i.getData()
            , a = i.getPosition();
          t.emit(e, {
            target: i,
            originalEvent: r,
            rawData: o,
            lnglat: a
          });
        });
      });
      c.push(marker);
    }
    (t._markerGroup = new Loca.AMapMarkerGroup(c, {
      fitView: fitView,
      blendMode: a,
      opacity: u
    })).addTo(t._container);
  });
}

export {
  getData,
  render,
  getMarkerStyleById
};
