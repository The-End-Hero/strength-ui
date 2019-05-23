maptool

地图工具栏



| Props              | Type | Default | Desc                     |
| ------------------ | ---- | ------- | ------------------------ |
| is_server_render   | bool | False   | 是否是静态瓦片服务器渲染 |
| map_style          | Str  |         | 地图默认样式             |
| saveAsJpeg         | Func |         | 截图调用函数             |
| turnOnRangingTool  | Func |         | 测距调用函数             |
| selectMapStyle     | Func |         | 切换地图样式             |
|                    |      |         | 全景调用函数             |
| onFullScreenCenter | Func |         | 全屏                     |
| fullscreencenter   | Bool |         | 当前是否是全屏           |
| pauseState         | Func |         | 点选状态点击回调         |
| selfSelect         | Func |         | 画圆回调                 |
| disSelect          | Func |         | 画多边形回调             |
| emptySelect        | Func |         | 清空回调                 |
| hasCustomDraw      | Bool |         | 是否有自定义围栏         |

