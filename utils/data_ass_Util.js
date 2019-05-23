import map from "lodash/map";

const singleType = ["point", "polygon", "line"];
const link_symbol = "-%-";

export function assemble(cards) {
  const data_style = {};
  const data_show_col = {};
  const data_info_cfg = {};
  const data_filters = {};
  const data_config_1 = {};
  const data_config_2 = {};
  const data_config_3 = {};
  const data_config_4 = {};
  const data_config_5 = {};
  const data_config_6 = {};
  map(cards, (c) => {
    const { uid, items, geo_filters } = c;
    const card_uid = uid;
    map(items, (i) => {
      const { source, geometry_type, object_type, packageId, filters } = i;
      map(filters, (f) => {
        const { uid: filter_uid, style, show_col, info_cfg, filters, config_1, config_2, config_3, config_4, config_5, config_6 } = f;
        const key = `${card_uid}${link_symbol}${filter_uid}${link_symbol}${source}${link_symbol}${geometry_type}${link_symbol}${object_type}${link_symbol}${packageId || ""}`;
        if (geometry_type.indexOf(singleType) > -1) { // 单地理
          if(style)data_style[key] = { single: style };
          if(show_col)data_show_col[key] = { single: show_col };
          if(info_cfg)data_info_cfg[key] = { single: info_cfg };
          if(filters)data_filters[key] = { single: filters };
          if(config_1)data_config_1[key] = { single: config_1 };
          if(config_2)data_config_2[key] = { single: config_2 };
          if(config_3)data_config_3[key] = { single: config_3 };
          if(config_4)data_config_4[key] = { single: config_4 };
          if(config_5)data_config_5[key] = { single: config_5 };
        } else { // 多地理
          
          
          
          
        }
      });
    });
  });


  return {
    data_style,
    data_show_col,
    data_info_cfg,
    data_filters,
    data_config_1,
    data_config_2,
    data_config_3,
    data_config_4,
    data_config_5,
    data_config_6
  };
}
