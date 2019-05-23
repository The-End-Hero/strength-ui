import coordtransform from "coordtransform";

function bd09togcj02(lng, lat) {
  let [p0, p1] = coordtransform.bd09togcj02(lng, lat);
  return { lng: p0, lat: p1 };
}

function gcj02tobd09(lng, lat) {
  let [p0, p1] = coordtransform.gcj02tobd09(lng, lat);
  return { lng: p0, lat: p1 };
}

function wgs84togcj02(lng, lat) {
  let [p0, p1] = coordtransform.wgs84togcj02(lng, lat);
  return { lng: p0, lat: p1 };
}

function gcj02towgs84(lng, lat) {
  let [p0, p1] = coordtransform.gcj02towgs84(lng, lat);
  return { lng: p0, lat: p1 };
}

function bd09towgs84(lng, lat) {
  let [p0, p1] = coordtransform.bd09togcj02(lng, lat);
  [p0, p1] = coordtransform.gcj02towgs84(p0, p1);
  return { lng: p0, lat: p1 };
}

function wgs84tobd09(lng, lat) {
  let [p0, p1] = coordtransform.wgs84togcj02(lng, lat);
  [p0, p1] = coordtransform.gcj02tobd09(p0, p1);
  return { lng: p0, lat: p1 };
}

const fn = {
  bd09togcj02,
  gcj02tobd09,
  wgs84togcj02,
  gcj02towgs84,
  bd09towgs84,
  wgs84tobd09
};
export default fn;
