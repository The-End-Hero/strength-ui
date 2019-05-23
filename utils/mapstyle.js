import bmapUtil from "./bmapUtil";
const transStyleJson = bmapUtil.transStyleJson
let styleJson = [
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": {
      "color": "#1f314eff"
    }
  },
  {
    "featureType": "highway",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#2b335aff"
    }
  },
  {
    "featureType": "highway",
    "elementType": "geometry.stroke",
    "stylers": {
      "color": "#1c212eff",
      "weight": "0.5"
    }
  },
  {
    "featureType": "arterial",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#191533ff"
    }
  },
  {
    "featureType": "arterial",
    "elementType": "geometry.stroke",
    "stylers": {
      "color": "#263151ff"
    }
  },
  {
    "featureType": "local",
    "elementType": "geometry",
    "stylers": {
      "color": "#1d2235ff"
    }
  },
  {
    "featureType": "land",
    "elementType": "all",
    "stylers": {
      "color": "#162235ff"
    }
  },
  {
    "featureType": "railway",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#000000"
    }
  },
  {
    "featureType": "railway",
    "elementType": "geometry.stroke",
    "stylers": {
      "color": "#08304b"
    }
  },
  {
    "featureType": "subway",
    "elementType": "geometry",
    "stylers": {
      "lightness": -70
    }
  },
  {
    "featureType": "building",
    "elementType": "geometry.fill",
    "stylers": {
      "color": "#1d1f35ff"
    }
  },
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#857f7fff"
    }
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": {
      "color": "#191b27ff"
    }
  },
  {
    "featureType": "building",
    "elementType": "geometry",
    "stylers": {
      "color": "#182745ff"
    }
  },
  {
    "featureType": "green",
    "elementType": "geometry",
    "stylers": {
      "color": "#152921ff"
    }
  },
  {
    "featureType": "boundary",
    "elementType": "all",
    "stylers": {
      "color": "#20254aff"
    }
  },
  {
    "featureType": "manmade",
    "elementType": "geometry",
    "stylers": {
      "color": "#022338"
    }
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": {
      "visibility": "off"
    }
  },
  {
    "featureType": "all",
    "elementType": "labels.icon",
    "stylers": {
      "visibility": "off"
    }
  },
  {
    "featureType": "all",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#6069a8ff",
      "visibility": "on"
    }
  },
  {
    "featureType": "town",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#4a649aff"
    }
  },
  {
    "featureType": "city",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#7490d4ff"
    }
  },
  {
    "featureType": "district",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#5773b8ff"
    }
  },
  {
    "featureType": "subway",
    "elementType": "labels.text.fill",
    "stylers": {
      "color": "#4f73bdff"
    }
  },
  {
    "featureType": "subway",
    "elementType": "geometry",
    "stylers": {
      "color": "#dce1efff",
      "weight": "0.6"
    }
  }
];

let styleStr = encodeURIComponent(transStyleJson(styleJson));

const bmapStyles = {
  "base": {
    "urlTemplate": `http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20181205&scale=2&styles=${styleStr}`,
    "subdomains": [0, 1, 2],
    "attribution": "&copy; <a href=\"http://map.baidu.com/\">Baidu</a>"
  },
  "normal": {
    "urlTemplate": "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=2&p=1",
    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "attribution": "&copy; <a href=\"http://map.baidu.com/\">Baidu</a>"
  },
  "wxt": {
    "urlTemplate": "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "attribution": "&copy; <a href=\"http://map.baidu.com/\">Baidu</a>"
  }
};


export {
  bmapStyles
};
