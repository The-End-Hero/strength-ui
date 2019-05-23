'use strict'
import {
    cloneDeep, map, find, forEach, indexOf, get, size, filter,
    isNumber, startsWith, minBy, maxBy
} from 'lodash'
import {
    searchDataSelectRef, geo_types,
    dis_select, self_select, fence_select, buffer_select,
    h_type_date, h_type_number, h_type_text, map_poi_icons as poi_icons, visualization_colors,
    mapHeaderKey, tableIcons, MapVisualTypes, source_customer,
    source_market, PolygonSourceKey, PolygonPackageIdKey, custom_card_menu,
    mapServerPointConfig, mapServerLineConfig, mapServerPolygonConfig
} from '../../../constants/Constants'
import { blob2md5 } from '../../../utils/strUtil'

const RenderFuncMixin = (superclass) => class RenderFuncMixin extends superclass {
    //
    getGeoFilterThumb = async () => {
        return new Promise((resolve) => {
            let cfg = this.getConfig()
            let { buffer_filters, cards, map_info } = cfg
            let geo_filters = {}
            if (buffer_filters) {
                geo_filters = buffer_filters
            } else if (size(cards) > 0) {
                geo_filters = cards[0].geo_filters
            }
            // console.log('upload geo path:', path);
            resolve({ geo_filters, map_info })
        })
    }

    getCurrentThumb = async () => {
        return new Promise((resolve) => {
            let mapIns = this.getMapPanelInstance()
            mapIns && mapIns.saveMapThumb((dataUrl) => {
                blob2md5(dataUrl, (md5str) => {
                    this.saveMapThumbService(dataUrl, md5str, (path) => {
                        resolve(path)
                    })
                })
            })
        })
    }

    getCurrentThumbUrl = async () => {
        return new Promise((resolve, reject) => {
            let mapIns = this.getMapPanelInstance()
            if (mapIns && mapIns.getCurrentThumbUrl) {
                mapIns.getCurrentThumbUrl((dataUrl) => {
                    resolve(dataUrl)
                })
            } else {
                reject()
            }
        })
    }

}
export default RenderFuncMixin
