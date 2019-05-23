"use strict";
import {
  cloneDeep, map, find, forEach, indexOf, get, size, filter,
  isNumber, startsWith, minBy, maxBy
} from "lodash";
import {
  searchDataSelectRef, geo_types,
  dis_select, self_select, fence_select, buffer_select,
  h_type_date, h_type_number, h_type_text, map_poi_icons as poi_icons, visualization_colors,
  mapHeaderKey, tableIcons, MapVisualTypes, source_customer,
  source_market, PolygonSourceKey, PolygonPackageIdKey, custom_card_menu,
  mapServerPointConfig, mapServerLineConfig, mapServerPolygonConfig
} from "../../../constants/Constants";

const GeoVisualMixin = (superclass) => class GeoVisualMixin extends superclass {
  geo_updateFilter = (filter_id, key, val) => {
    let { geo_filters, current_geo_filter } = this.state;
    current_geo_filter.filters[0][key] = val;
    for (let i = 0; i < geo_filters.length; i++) { // 获取当前围栏
      if (current_geo_filter.object_type === geo_filters[i].object_type && current_geo_filter.source === geo_filters[i].source) {
        if (!geo_filters[i].filters) {
          geo_filters[i].filters = [{}];
        }
        geo_filters[i].filters[0][key] = val;
      }
    }
    this.setState({ geo_filters, current_geo_filter }, () => {
      this.updateBgPolygon();
    });
  };

  geo_updateCurrentVisual = (filter_id, current_visual) => {
    let { geo_filter, current_geo_filter } = this.state;
    current_geo_filter = current_geo_filter || {};
    let { filters } = current_geo_filter 
    let fdFilter = filters && filters[0] || {};
    if (!current_visual) {
      let lastVisual = fdFilter.cur_visual;
      delete fdFilter.cur_visual;
      if (lastVisual) {
        this.updateBgPolygon();
      }
    } else {
      fdFilter.cur_visual = current_visual;
    }
    this.setState({ geo_filter, current_geo_filter });
  };

  getGeoTableHeaders = () => {
    let { current_geo_filter, columnTypes } = this.state;
    let { object_type, geometry_type, source, packageId, filters } = current_geo_filter;
    source = source || source_customer;
    packageId = packageId || "";
    let data = filters[0].data;
    let tabData: any = {
      object_type,
      geometry_type,
      id: JSON.stringify({ object_type, geometry_type }),
      name: object_type,
      icon: tableIcons[geometry_type]
    };
    tabData.data = data;
    let tableHeader = map(columnTypes[source][packageId][geometry_type][object_type], t => {
      return {
        id: `extra.${t.key}`,
        title: t.h_value
      };
    });
    tableHeader.unshift(...mapHeaderKey);
    return { tabData: [tabData], tableHeader };
  };

  //菜单
  geo_filterMoreMenuCallback = (filter_id, e, menu, sub) => {
    e && e.preventDefault();
    e && e.stopPropagation();
    let { id: menu_id } = menu;
    let { setTabData } = this.props;
    let { geo_filter, current_geo_filter } = this.state;
    let fdFilter = geo_filter.filters && geo_filter.filters[0];
    let newfdFilter = current_geo_filter.filters && current_geo_filter.filters[0];

    switch (menu_id) {
      case custom_card_menu.detail: //详情
        let tab = this.getGeoTableHeaders();
        setTabData && setTabData(tab.tabData, tab.tableHeader);
        break;
      case custom_card_menu.show_col:
        if (sub.key == "__delete__") {
          fdFilter && (fdFilter.show_col = undefined);
          newfdFilter.show_col = undefined;
        } else {
          fdFilter && (fdFilter.show_col = sub.key);
          newfdFilter.show_col = sub.key;
        }
        this.updateBgPolygon();
        break;
    }
  };

};
export default GeoVisualMixin;
