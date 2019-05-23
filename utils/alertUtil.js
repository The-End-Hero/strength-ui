import sweetAlert from "../static/lib/sweetalert/lib/sweetalert";
import { okLabel, cancelLabel, alertTime } from "../constants/constants";
import forEach from "lodash/forEach";

const askIcon = require('../static/images/alert_icon/Ask.png')
import { testLink } from "./strUtil";
let alertUtil
const _default = {
  alertMsg: function(title, text = "", type = "warning", cls = null, timer = alertTime, showConfirmButton = true, imageUrl = "") {
    sweetAlert({
      title,
      text,
      type,
      timer,
      customClass: cls,
      confirmButtonText: okLabel,
      showConfirmButton,
      imageUrl
    });
  },
  showLoading: function(title, text = "", type = "warning", timer = alertTime, showConfirmButton = false, showCancelButton = false, confirmButtonText = okLabel, cancelButtonText = cancelLabel, closeOnConfirm = false, cls = null, callback) {
    sweetAlert({
      title,
      text,
      type,
      html: true,
      timer,
      customClass: cls,
      confirmButtonText,
      showConfirmButton,
      showCancelButton,
      cancelButtonText,
      closeOnConfirm
    }, callback);
  },
  showConfirm: function(title, text = "", callback, imageUrl = askIcon, type = "", closeOnConfirm = true, cls = null) {
    sweetAlert({
      title,
      text,
      html: true,
      timer: null,
      customClass: cls,
      confirmButtonText: okLabel,
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: cancelLabel,
      closeOnConfirm,
      imageUrl,
      type
    }, callback);
  },
  advanceAlert: function(title, text = "", cls = null, imageUrl = "", showConfirmButton = false) {
    console.log(sweetAlert)
    sweetAlert({
      title,
      text,
      html: true,
      timer: null,
      customClass: cls,
      showConfirmButton,
      confirmButtonText: okLabel,
      showCancelButton: false,
      closeOnConfirm: false,
      imageUrl
    });
  },
  showConfirmExt: function(title, text, callback, errTip = "名称不能为空", maxLen = 0) {
    const imgUrl = "/images/alert_icon/Info.png";
    this.showConfirm(title, text, (args) => {
      if (args === "") {
        let error = document.getElementsByClassName("sa-input-error");
        let lastTip = error[0].getElementsByClassName("input_name_error");
        forEach(lastTip, t => {
          t && t.remove();
        });
        let span = document.createElement("span");
        span.innerHTML = errTip;
        span.className = "input_name_error";
        error[0].appendChild(span);
        $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
        $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
        $(".base .sweet-alert p").css({ color: "#FF756D" });
        return false;
      }
      if (args === false) args = "";
      if (maxLen && args.length > maxLen) {
        $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
        $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
        $(".base .sweet-alert p").css({ color: "#FF756D" });
        return false;
      }
      let alertDom = document.getElementsByClassName("sweet-alert");
      let alertDomOverlay = document.getElementsByClassName("sweet-overlay");
      forEach(alertDom, t => t && t.remove());
      forEach(alertDomOverlay, t => t && t.remove());
      args && callback && callback(args);
    }, imgUrl, "input", false);
    let alertDom = $(".sweet-alert fieldset input");
    alertDom && alertDom[0] && alertDom[0].addEventListener("input", e => {
      let val = e.target.value;
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(function() {
        let error = document.getElementsByClassName("sa-input-error");
        if (!error[0]) return;
        let lastTip = error[0].getElementsByClassName("input_name_error");
        forEach(lastTip, t => {
          t && t.remove();
        });

        if (val !== "") {
          if (maxLen && val.length > maxLen) {
            $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
            $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
            $(".base .sweet-alert p").css({ color: "#FF756D" });
          } else {
            $(".sweet-alert input").css({ borderBottomColor: "#d7d7d7" });
            $(".base .sweet-alert p").css({ color: "#fff" });
          }
        } else {
          let span = document.createElement("span");
          span.innerHTML = errTip;
          span.className = "input_name_error";
          error[0].appendChild(span);
          $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
          $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
          $(".base .sweet-alert p").css({ color: "#FF756D" });
        }
      }, 300);
    });
  },
  showConfirmLink(title, text, callback, errTip = "输入有误", regexpFunc = testLink, maxLen = 0) {
    const imgUrl = "/images/alert_icon/Info.png";
    this.showConfirm(title, text, (args) => {
      if (!regexpFunc(args)) {
        let error = document.getElementsByClassName("sa-input-error");
        let lastTip = error[0].getElementsByClassName("input_name_error");
        forEach(lastTip, t => {
          t && t.remove();
        });
        let span = document.createElement("span");
        span.innerHTML = errTip;
        span.className = "input_name_error";
        error[0].appendChild(span);
        $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
        $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
        $(".base .sweet-alert p").css({ color: "#FF756D" });
        return false;
      }
      if (args === false) args = "";
      if (maxLen && args.length > maxLen) {
        $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
        $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
        $(".base .sweet-alert p").css({ color: "#FF756D" });
        return false;
      }
      let alertDom = document.getElementsByClassName("sweet-alert");
      let alertDomOverlay = document.getElementsByClassName("sweet-overlay");
      forEach(alertDom, t => t && t.remove());
      forEach(alertDomOverlay, t => t && t.remove());
      args && callback && callback(args);
    }, imgUrl, "input", false);
    let alertDom = $(".sweet-alert fieldset input");
    alertDom && alertDom[0] && alertDom[0].addEventListener("input", e => {
      let val = e.target.value;
      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(function() {
        let error = document.getElementsByClassName("sa-input-error");
        if (!error[0]) return;
        let lastTip = error[0].getElementsByClassName("input_name_error");
        forEach(lastTip, t => {
          t && t.remove();
        });

        if (regexpFunc(val)) {
          if (maxLen && val.length > maxLen) {
            $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
            $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
            $(".base .sweet-alert p").css({ color: "#FF756D" });
          } else {
            $(".sweet-alert input").css({ borderBottomColor: "#d7d7d7" });
            $(".base .sweet-alert p").css({ color: "#fff" });
          }
        } else {
          let span = document.createElement("span");
          span.innerHTML = errTip;
          span.className = "input_name_error";
          error[0].appendChild(span);
          $(".sweet-alert input").css({ borderBottomColor: "#FF756D" });
          $(".sweet-alert input:focus").css({ borderBottomColor: "#FF756D !important" });
          $(".base .sweet-alert p").css({ color: "#FF756D" });
        }
      }, 300);
    });
  }
};
export default _default
