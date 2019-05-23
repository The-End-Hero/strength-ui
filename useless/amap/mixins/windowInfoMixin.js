import forEach from "lodash/forEach";
import get from "lodash/get";
import size from "lodash/size";
import { marker_id_feedback } from "../../../constants/constants";

const WindowInfoMixin = (superclass) => class WindowInfoMixin extends superclass {

  hideInfoWindow = (e)=> {
    // console.log('hideInfoWindow')
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let map = this.map;
    if (this.infoWindow && map) map.remove(this.infoWindow);
  }

  createInfoWindow=(fdFilter, pos, data, e) =>{
    // console.log('createInfoWindow', fdFilter, pos, data)
    if (size(fdFilter.info_cfg)) {
      let map = this.map;
      let content = document.createElement("div");
      content.className = "info_window_wrap new_map";
      let close = document.createElement("div");
      close.className = "info_window_close";
      close.onclick = () => {
        this.hideInfoWindow();
      };
      let closeSpan = document.createElement("i");
      closeSpan.className = "material-icons";
      closeSpan.innerText = "close";
      close.appendChild(closeSpan);
      content.appendChild(close);
      let inner = document.createElement("div");
      inner.className = "info_window_inner";
      let ttt = 0;
      forEach(fdFilter.info_cfg, t => {
        ttt += 47;
        let valKey = "";
        if (t.key === "name" || t.key === "address") {
          valKey = t.key;
        } else {
          valKey = `extra.${t.key}`;
        }
        let val = get(data, valKey) || "-";
        let tit = document.createElement("div");
        tit.className = "info_window_label";
        tit.innerText = t.h_value;
        inner.appendChild(tit);
        let cont = document.createElement("div");
        cont.className = "info_window_content";
        cont.innerText = val;
        inner.appendChild(cont);
      });
      content.appendChild(inner);
      let trig = document.createElement("span");
      trig.className = "info_window_triggle";
      content.appendChild(trig);

      // 永辉-反馈
      this.hideWindow(marker_id_feedback);
      // let { coreLayout: { loginUser: { app_id } } } = this.props;
      // if ((app_id == yonghui_appid)) {
      //   let evaluate = document.createElement("div");
      //   evaluate.className = "info_window_evaluate";
      //   evaluate.innerText = "评估点位";
      //   evaluate.onclick = () => {
      //     this.parmas = { id: data.id, extra: this.getInitialParam() };
      //     this.createEvaluateStartShop(pos, data, e);
      //   };
      //   content.appendChild(evaluate);
      // }
      const offsetY = (33 + ttt) > 300 ? 310 : (33 + ttt);
      // console.log(pos,'pos-----')
      let marker = new window.AMap.Marker({
        bubble: false,
        map,
        position: pos,
        content,
        offset: new window.AMap.Pixel(-110, -offsetY)
      });
      this.infoWindow = marker;
    }
  }

  hideWindow=(markId) =>{
    let map = this.map;
    if (markId && this[markId] && map) map.remove(this[markId]);
  }
};
export default WindowInfoMixin;
