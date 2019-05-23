import map from "lodash/map";
import { h_type_text, h_type_number, h_type_date } from "../../../constants/constants";


const getLabel = (column) => {
  let sub = "";
  if (column.h_type === h_type_text) {
    if (column.list) {
      sub = column.list.join("、");
    }
  } else if (column.h_type === h_type_number) {
    let { min, max } = column;
    if (min !== undefined && max !== undefined) {
      sub = `${min}-${max}`;
    } else if (max !== undefined) {
      sub = `${max}以下`;
    } else if (min !== undefined) {
      sub = `${min}以上`;
    }
  } else if (column.h_type === h_type_date) {
    let { start, end, fast_type, end_is_today } = column;
    if (end_is_today) {
      sub = `${start}至今`;
    } else if (fast_type) {
      sub = fast_type;
    } else {
      sub = start ? `${start} - ${end}` : "";
    }
  }
  return sub;
};

const getFilterDescItem = (col) => {
  return `${col.h_value}: ${getLabel(col)}`;
};

const getFilterDesc = (filters) => {
  return map(filters, t => getFilterDescItem(t)).join("/") || "全部";
};

export default {
  getLabel,
  getFilterDescItem,
  getFilterDesc
};
