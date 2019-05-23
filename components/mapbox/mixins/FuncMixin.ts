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
} from '../../../constants/constants'
import { blob2md5 } from '../../../utils/strUtil'

const FuncMixin = (superclass) => class FuncMixin extends superclass {
    /**
     * 获取整个需要保存的地理分析
     * @returns {{name: *|string, title: *, cards: *, geo_filter: *, current_geo_filter: *, type: string, buffer_filters: *, supp_filters: *, static_cards: *, map_info: *|{location: string, zoom: *, size: string, scale: number}, init_type: *, map_style: *, data_alias: *, refresh_time: *, screening_method: *}}
     */
    getConfig = () =>{
        let mapUid = this.props.data && this.props.data.name || this.props.mapUid
        let {
            mapName, cards, static_cards, geo_filters, current_geo_filter,
            init_type, map_style, data_alias, refresh_time, screening_method
        } = this.state
        let ref = this.refs.topFilter
        let supp_filters = ref && ref.getSuppFilters()
        let type = MapVisualTypes.NEW_INTERACTIVE_MAP
        let cds = map(cards, t => {
            return {
                ...t,
                items: map(t.items, it => {
                    return {
                        ...it,
                        filters: map(it.filters, f => {
                            let { data, _count_, ...oths } = f
                            return oths
                        })
                    }
                })
            }
        })
        let buffer_filters:any = null
        if (size(this.buffer_filters)) {
            buffer_filters = { 
              type: buffer_select,
              filters_new: this.buffer_filters
            }
        }
        let {  ...geof } = current_geo_filter || {}
        let interactive_map = {
            name: mapUid,
            title: mapName,
            cards: cds,
            geo_filter: geo_filters,
            current_geo_filter: current_geo_filter ? {
                ...geof,
                filters: map(geof.filters, f => {
                    let { data, _count_, ...oths } = f
                    return oths
                })
            } : null,
            type,
            buffer_filters,
            supp_filters,
            static_cards: static_cards,
            map_info: this.getMapInfo(),
            init_type: init_type,
            map_style: map_style, // 地图初始化style
            data_alias: data_alias, // 数据别名
            refresh_time: refresh_time, //刷新时间
            screening_method: screening_method, // 筛选方法
            is_server_render: true
        }

        // 解决packageId为空字符串的问题等 校验
        for (let i = 0; i < interactive_map.static_cards.length; i++) {
            if (interactive_map.static_cards[i].geo_filters.packageId === '') {
                interactive_map.static_cards[i].geo_filters.packageId = null
            }
            if (typeof interactive_map.static_cards[i].geo_filters.type === 'string') {
                interactive_map.static_cards[i].geo_filters.type = Number(interactive_map.static_cards[i].geo_filters.type)
            }
            if (!(type in interactive_map.static_cards[i].geo_filters)) { // 如果type不存在,则给type为2
                interactive_map.static_cards[i].geo_filters.type = 2
            }
            for (let j = 0; j < interactive_map.static_cards[i].items.length; j++) {
                if (interactive_map.static_cards[i].items[j].packageId === '') {
                    interactive_map.static_cards[i].items[j].packageId = null
                }
            }
            if (interactive_map.static_cards[i].geo_filters.filters && interactive_map.static_cards[i].geo_filters.filters.length) {
                for (let j = 0; j < interactive_map.static_cards[i].geo_filters.filters.length; j++) {
                    if (interactive_map.static_cards[i].geo_filters.filters[j].packageId === '') {
                        interactive_map.static_cards[i].geo_filters.filters[j].packageId = null
                    }
                    delete interactive_map.static_cards[i].geo_filters.filters[j].data
                }
            }
            for (let j = 0; j < interactive_map.static_cards[i].items.length; j++) {
                for (let k = 0; k < interactive_map.static_cards[i].items[j].filters.length; k++) {
                    delete interactive_map.static_cards[i].items[j].filters[k].data
                }
            }
        }
        for (let i = 0; i < interactive_map.geo_filter.length; i++) {
            if (interactive_map.geo_filter[i].packageId === '') {
                interactive_map.geo_filter[i].packageId = null
            }
            if (interactive_map.geo_filter[i].filters && interactive_map.geo_filter[i].filters[0]) {
                delete interactive_map.geo_filter[i].filters[0].data
            }
            delete interactive_map.geo_filter[i].geo_type
        }
        for (let i = 0; i < interactive_map.supp_filters.length; i++) {
            if (interactive_map.supp_filters[i].packageId === '') {
                interactive_map.supp_filters[i].packageId = null
            }
        }
        return interactive_map
    }

    /**
     * 获取地图的保存信息 比如初始化位置,缩放级别等
     * @returns {{location: string, zoom: *, size: string, scale: number}}
     */
    getMapInfo = () => { // 获取地图信息
        const mapIns = this.getMapInstance()
        const data = {
            location: '121,31',
            zoom: 13,
            size: '400*400',
            scale: 1
        }
        if (!mapIns) {
            return data
        }
        const center = mapIns.getCenter()
        data.location = `${center.x},${center.y}`
        data.zoom = mapIns.getZoom()
        data.size = '400*400' //图片宽度*图片高度。最大值为1024*1024
        data.scale = 1 //1:返回普通图；2:调用高清图
        return data
    }
}

export default FuncMixin
