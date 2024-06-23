// <reference path="./lib.wx.component.d.ts" />

declare namespace WechatMiniprogram {
  interface FormEvent<Detail extends IAnyObject = IAnyObject> extends CustomEvent {
    detail: {
      value: Detail
      formId: string
    }
  }

  namespace Component {
    interface A {
      a: string
    }
  }
}
