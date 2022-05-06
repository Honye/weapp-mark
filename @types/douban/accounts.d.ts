declare namespace Douban {
  interface AccountInfo {
    name: string;
    weixin_binded: boolean;
    phone: string;
    avatar: Record<'medium'|'median'|'large'|'raw'|'small'|'icon', string>;
    id: string;
    uid: string;
  }
}
