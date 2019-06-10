import React, { Component } from "react";
import Modal from "../../components/modals";
import Button from "../../components/button";
import Checkbox from "../../components/checkbox";

export default class ModalPage extends Component {
  state = {
    visible: false,
    loading: false
  };
  onCancel = visible => {
    this.setState({
      [visible]: false
    });
  };
  onShow = (visible = "visible") => {
    this.setState({
      [visible]: true
    });
  };

  render() {
    return (
      <div>
        <h2>基本使用</h2>
        <Button type="primary" onClick={() => this.onShow("visible")}>
          打开
        </Button>
        <h2>自定义文案</h2>
        <Button type="primary" onClick={() => this.onShow("visible2")}>
          打开
        </Button>
        <h2>异步加载</h2>
        <Button type="primary" onClick={() => this.onShow("visible3")}>
          打开
        </Button>
        <h2>自定义 footer</h2>
        <Button type="primary" onClick={() => this.onShow("visible20")}>
          打开
        </Button>
        <h2>无 footer</h2>
        <Button type="primary" onClick={() => this.onShow("visible4")}>
          打开
        </Button>
        <h2>无标题</h2>
        <Button type="primary" onClick={() => this.onShow("visible10")}>
          打开
        </Button>
        {/*<h2>居中显示</h2>*/}
        {/*<Button type="primary" onClick={() => this.onShow("visible5")}>*/}
          {/*打开*/}
        {/*</Button>*/}
        <h2>点击蒙版不关闭</h2>
        <Button type="info" onClick={() => this.onShow("visible6")}>
          打开
        </Button>
        <h2>自定义z-index</h2>
        <Button type="info" onClick={() => this.onShow("visible8")}>
          zIndex: 10000
        </Button>
        <h2>自定义宽度</h2>
        <Button type="info" onClick={() => this.onShow("visible9")}>
          width: 400
        </Button>
        <h2>不显示关闭按钮</h2>
        <Button type="warning" onClick={() => this.onShow("visible7")}>
          打开
        </Button>
        <h2>自定按钮属性</h2>
        <Button type="primary" onClick={() => this.onShow("visible30")}>
          打开
        </Button>
        <h2>超长高度</h2>
        <Button type="primary" onClick={() => this.onShow("visible31")}>
          姚明在弹框里面
        </Button>
        <h2>不显示蒙版</h2>
        <Button type="primary" onClick={() => this.onShow("visible32")}>
          打开
        </Button>
        <h2>信息提示</h2>
        <Button
          onClick={() => {
            Modal.confirm({
              title: "msmmss",
              content: "22222",
              onOk() {
                console.log("ok!");
              },
              onCancel() {
                console.log("cancel!");
              }
            });
          }}
        >
          Modal.confirm()
        </Button>
        <Button
          onClick={() => {
            Modal.success({
              title: "eedede",
              content: "qqqqq"
            });
          }}
        >
          Modal.success()
        </Button>
        <Button
          onClick={() => {
            Modal.info({
              title: "生生世世",
              content: "呜呜呜呜"
            });
          }}
        >
          Modal.info()
        </Button>

        <Button
          onClick={() => {
            Modal.error({
              title: "呜呜呜呜",
              content: "清清浅浅"
            });
          }}
        >
          Modal.error()
        </Button>
        <Button
          onClick={() => {
            Modal.info({
              title: "呃呃呃呃",
              content: "1",
              showMask: false
            });
          }}
        >
          不显示蒙版
        </Button>

        <Button
          onClick={() => {
            Modal.warning({
              title: "OKOK吗",
              content: "乒乒乓乓"
            });
          }}
        >
          Modal.warning()
        </Button>
        <Button
          onClick={() => {
            Modal.loading({
              title: "iiii 家",
              content: "wwd "
            });
          }}
        >
          Modal.loading()
        </Button>
        <Button
          onClick={() => {
            Modal.prompt({
              title: "uuuu",
              onOk({ value, checked }) {
                console.log(value, checked);
              }
            });
          }}
        >
          Modal.prompt()
        </Button>

        <Button
          onClick={() => {
            Modal.prompt({
              title: "为以下商品付款",
              content: <Checkbox/>,
              onOk({ value, checked }) {
                console.log(value, checked);
              }
            });
          }}
        >
          自定义内容的 Modal.prompt()
        </Button>

        <Button
          onClick={() => {
            Modal.success({
              title: "hello",
              content: "how are you",
              closable: true
            });
          }}
        >
          显示X
        </Button>
        <h2>自定义图标类型</h2>
        <Button
          type="success"
          onClick={() => {
            Modal.info({
              iconType: "success",
              title: "搜索事实上",
              content: "娶妻娶德前端"
            });
          }}
        >
          success
        </Button>
        <Button
          type="error"
          onClick={() => {
            Modal.loading({
              iconType: "error",
              title: "你几句",
              content: "OKOK卡"
            });
          }}
        >
          error
        </Button>

        <h2>组件调用</h2>
        <Modal
          title="基本使用"
          visible={this.state.visible}
          onCancel={() => this.onCancel("visible")}
          onOk={() => this.onCancel("visible")}
        >
          <span> hello its me </span>
        </Modal>

        <Modal
          title="自定义"
          visible={this.state.visible2}
          okText="哈哈哈"
          cancelText="嘻嘻嘻"
          onCancel={() => this.onCancel("visible2")}
          onOk={() => this.onCancel("visible2")}
        >
          <span>自定义文字</span>
        </Modal>


        <Modal
          title="自定义 footer"
          visible={this.state.visible20}
          footer={
            <>
              <Button key="a" onClick={() => this.onCancel("visible20")}>取消</Button>
              <Button key="b" disabled>按钮2</Button>
              <Button key="c" type="primary" onClick={() => this.onCancel("visible20")}>按钮3</Button>
            </>
          }
          onCancel={() => this.onCancel("visible20")}
          onOk={() => this.onCancel("visible20")}
        >
          我有三个
        </Modal>

        <Modal
          title="异步加载"
          visible={this.state.visible3}
          confirmLoading={this.state.loading}
          onCancel={() => this.onCancel("visible3")}
          onOk={() =>
            this.setState({ loading: true }, () =>
              setTimeout(
                () => this.setState({ loading: false, visible3: false }),
                2000
              )
            )
          }
        >
          <span>点击确定</span>
        </Modal>

        <Modal
          title="没有footer"
          visible={this.state.visible4}
          footer={null}
          onCancel={() => this.onCancel("visible4")}
          onOk={() => this.onCancel("visible4")}
        >
          <span>自定义文字</span>
        </Modal>

        {/*<Modal*/}
          {/*title="居中"*/}
          {/*visible={this.state.visible5}*/}
          {/*centered*/}
          {/*onCancel={() => this.onCancel("visible5")}*/}
          {/*onOk={() => this.onCancel("visible5")}*/}
        {/*>*/}
          {/*<span>自定义文字</span>*/}
        {/*</Modal>*/}

        <Modal
          title="点击蒙版不关闭"
          visible={this.state.visible6}
          maskClosable={false}
          onCancel={() => this.onCancel("visible6")}
          onOk={() => this.onCancel("visible6")}
        >
          <span>自定义文字</span>
        </Modal>

        <Modal
          title="不显示关闭按钮"
          visible={this.state.visible7}
          closable={false}
          onCancel={() => this.onCancel("visible7")}
          onOk={() => this.onCancel("visible7")}
        >
          <span>自定义文字</span>
        </Modal>

        <Modal
          title="z-index:10000"
          zIndex={10000}
          visible={this.state.visible8}
          onCancel={() => this.onCancel("visible8")}
          onOk={() => this.onCancel("visible8")}
        >
          <span>z-index:10000</span>
        </Modal>

        <Modal
          title="自定义宽度"
          width={400}
          visible={this.state.visible9}
          onCancel={() => this.onCancel("visible9")}
          onOk={() => this.onCancel("visible9")}
        >
          <span>宽度:400px</span>
        </Modal>

        <Modal
          visible={this.state.visible10}
          onCancel={() => this.onCancel("visible10")}
          onOk={() => this.onCancel("visible10")}
        >
          <span>没有标题</span>
        </Modal>

        <Modal
          title="自定义按钮属性"
          visible={this.state.visible30}
          onCancel={() => this.onCancel("visible30")}
          onOk={() => this.onCancel("visible30")}
          okButtonProps={{
            disabled: true,
            loading: true,
            type: "default"
          }}
          cancelButtonProps={{
            type: "info"
          }}
        >
          <span>自定义按钮属性</span>
        </Modal>

        <Modal
          title="超长modal"
          visible={this.state.visible31}
          onCancel={() => this.onCancel("visible31")}
          onOk={() => this.onCancel("visible31")}
        >
          <div style={{ height: window.innerHeight * 2 }}>我是姚明</div>
        </Modal>

        <Modal
          title="没有蒙版"
          showMask={false}
          visible={this.state.visible32}
          onCancel={() => this.onCancel("visible32")}
          onOk={() => this.onCancel("visible32")}
        >
          <span>123</span>
        </Modal>
      </div>
    );
  }
}
