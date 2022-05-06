declare namespace Douban {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface APIResponseLegacy<T = any> {
    status: 'success'|'failed';
    message: string;
    description: string;
    payload: T;
  }

  interface LoginSuccessResult {
    access_token: string;
    douban_user_id: string;
    account_info: Douban.AccountInfo;
    douban_user_name: string;
    expires_in: number;
    refresh_token: string;
  }
}
