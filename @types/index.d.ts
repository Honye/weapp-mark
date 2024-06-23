import 'miniprogram-api-typings'

declare namespace IMarkr {
}

interface RequestController extends WechatMiniprogram.RequestTask {
  task: WechatMiniprogram.RequestTask;
}

interface RequestOption<T> extends Omit<WechatMiniprogram.RequestOption<T>, 'success' | 'fail' | 'complete'> {
  baseURL?: string;
  controller?: RequestController;
  notAuthorization?: boolean
}

interface RequestSuccessResult<T> extends WechatMiniprogram.RequestSuccessCallbackResult<T> {
  ok: boolean;
}
