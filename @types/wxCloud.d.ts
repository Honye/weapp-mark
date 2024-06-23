interface CloudFunctionBaseEvent {
  userInfo: { appId: string; openId: string };
}

type CloudFunctionEvent<T extends Record<string, any> = {}> = CloudFunctionBaseEvent & T;
interface CloudFunctionContext {
  callbackWaitsForEmptyEventLoop: boolean;
  memory_limit_in_mb: number;
  time_limit_in_ms: number;
  request_id: string;
  environment: string;
  environ: string;
  function_version: string;
  function_name: string;
  namespace: string;
  tencentcloud_region: string;
  tencentcloud_appid: string;
  tencentcloud_uin: string;
}

interface CloudFunction<Event extends Record<string, any> = {}, Result = void> {
  (event: CloudFunctionEvent<Event>, context: CloudFunctionContext): Result;
}

interface CallCloudOptions {
  /** 是否显示加载提示框 */
  loading?: boolean;
  /** 是否显示错误提示框 */
  showError?: boolean;
}

interface CallCloud {
  (name: 'login', data: Record<string, any>, options: CallCloudOptions): Promise<any>;

  (name: 'doouban', data: Record<string, any>, options: CallCloudOptions): Promise<any>;
}
