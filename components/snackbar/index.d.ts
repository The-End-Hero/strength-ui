/**
 * 使用说明
 * import snackbar from 'snackbar'
 * snackbar.info(a,v,b,n)
 * @type {{info: _default.info}}
 * @private
 */
declare const _default: {
  /**
   * 参数
   * @param type 信息类型 success|error|info|warning  string 默认success
   * @param msg  snackbar展示文字  string
   * @param hasClose 是否有关闭按钮，如果有，则不会自动关闭。 bool 默认为false
   * @param delay 自动关闭时间(秒) num 默认为5
   */
  info: (
    type?: string,
    msg?: string,
    hasClose?: boolean,
    delay?: number,
    hasCancle?: boolean | undefined,
    cancle?: any,
    autoClose?: boolean | undefined
  ) => void;
};
export default _default;
