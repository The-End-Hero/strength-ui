export const cards = [
  {
    items: [
      {
        filters: [
          {
            uid: "filter_76a58c30-f2ea-11e8-b796-fdf5baa4a33b",
            filters: [],
            info_cfg: true,
            show_col: true,
            style: true
          }
        ],
        source: ""

      }
    ],
    uid: "card_f57ad610-f2e9-11e8-b796-fdf5baa4a33b"
  }
];


export const map_state = "2"; // 地图状态


// 层级 第一层级 card_uid + data_info(相连) + filter_uid  分割符号 -%%-
// 第二层 from to single
// 第三层 具体config
export const data_show_col = {
  "${card_uid}+${data_info}+${filter_uid}": {
    from: "", to: "开盘项目", single: ""
  }
};

export const data_style = {
  "${card_uid}+${data_info}+${filter_uid}": {
    from: "", to: {icon:''}, single: ""
  }
};
