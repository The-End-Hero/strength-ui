import serialize from "./serialize";
import size from "lodash/size";

export default (url, params, unEncode) => {
  return size(params) ? `${url}?${serialize(params, unEncode)}` : url;
}
