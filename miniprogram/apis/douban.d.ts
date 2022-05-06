declare const BASE_URL: string

declare const request: <T>(params: WechatMiniprogram.RequestOption) => Promise<T>

/** 搜索 */
export const search: (params: {
  /** 关键字 */
  q: string
  /** 起始位置 */
  start: number
  /** 查询数量 */
  count: number
}) => Promise<DouBan.SearchResult>

/** 影视详情 */
export const getDetail: (params: {
  /** 影视 ID */
  id: string;
  type?: 'movie'|'tv';
}) => Promise<DouBan.MovieDetail>

/** 影人列表 */
export const getCelebrities: (params: {
  /** 影视 ID */
  id: string;
  type?: 'movie'|'tv';
}) => Promise<{
  actors: DouBan.Actor[];
  directors: DouBan.Actor[];
  total: number;
}>;

/** 短评列表 */
export const getInterests: (params: {
  id: string;
  start: number;
  count: number;
  status?: 'done';
  type?: 'movie'|'tv';
}) => Promise<DouBan.InterestResult>

/** 剧照 */
export const getPhotos: (params: {
  id: string;
  start: number;
  count: number;
  type?: 'movie'|'tv';
}) => Promise<DouBan.PhotosResult>

/** 预告片列表 */
export const getTrailers: (params: {
  id: string;
}) => Promise<DouBan.TrailersResult>

/** 豆瓣热门 */
export const getHotMovies: (params: {
  start?: number;
  count?: number;
}) => Promise<{
  count: number;
  subject_collection_items: Array<DouBan.MovieItem>,
  total: number;
  start: number;
}>

/** 榜单合集 */
export const getCollectionList: (params: {
  type: string;
  start?: number;
  count?: number;
}) => Promise<{
  count: number;
  subject_collection: {
    subject_type: DouBan.SubjectType;
    updated_at: string;
    total: number;
    header_fg_image: string;
    header_bg_image: string;
    title: string;
    icon_text: string;
    id: string;
    description: string;
    done_count: number;
  };
  subject_collection_items: Array<DouBan.MovieItem>;
  total: number;
  start: number;
}>

/** 影院热映 */
export const getShowingMovies: (params: {
  start?: number
  count?: number
}) => Promise<{
  count: number
  subject_collection_items: Array<{
    rating: {
      max: number
      value: number
    }
    cover: {
      url: string
    }
    year: string
    id: string
    title: string
    type: 'movie'
    info: string
    url: string
    release_date: string
    original_title: string
    uri: string
  }>
  total: number
  start: number
}>

/** 即将上映 */
export const getSoonMovies: (params: DouBan.ListParams) => Promise<DouBan.ListResult & {
  subject_collection_items: Array<{
    rating: {
      max: number
      value: number
    }
    cover: {
      url: string
    }
    year: string
    id: string
    title: string
    type: 'movie'|'tv'
    most_recent_release_date: string
    info: string
    url: string
    release_date: string
    original_title: string
    uri: string
  }>
}>

/** 获取用户的书影音 */
export const getUserInterests: (userID: string, params: {
  type: DouBan.SubjectType;
  status: DouBan.InterestStatus;
  start?: number;
  count?: number;
}) => Promise<{
  count: number;
  start: number;
  total: number;
  interests: Array<{
    rating: DouBan.Rating;
    tags: string[];
    create_time: string;
    status: DouBan.InterestStatus;
    id: string;
    is_private: boolean;
    subject: DouBan.Movie;
  }>
}>

/** 登录 */
export const login: (params: {
  /** 用户名 */
  name: string;
  password: string;
  /** 小程序 AppID */
  appid?: string;
  phone?: string;
  captcha_id?: string;
  captcha_solution?: string;
  ticket?: string;
  randstr?: string;
}) => Promise<{
  status: 'success'|'failed';
  message: string;
  description: string;
  payload: {
    access_token: string;
    douban_user_id: string;
    account_info: {
      name: string;
      weixin_binded: boolean;
      phone: string;
      avatar: { medium: string; median: string; large: string; raw: string; small: string; icon: string; };
      id: string;
      uid: string;
    };
    douban_user_name: string;
    expires_in: number;
    refresh_token: string;
  }|{
    captcha_id: string;
    captcha_image_url: string;
    captcha_signature_sample: string;
    tc_app_id: string;
    touch_cap_url: string;
  };
}>

/** 标记影视为想看 */
export const markMovie: (params: {
  movieID: string;
  type?: DouBan.SubjectType;
  rating?: 1|2|3|4|5;
  sync_douban?: 0|1;
}) => Promise<DouBan.Interest>

/** 删除影视标记 */
export const unmarkMovie: (params: {
  movieID: string;
  type?: DouBan.SubjectType;
}) => Promise<{
  comment: string;
  status: DouBan.InterestStatus;
  id: string;
}>

/** 标记影视为已看 */
export const doneMovie: (params: {
  movieID: string;
  type?: 'movie'|'tv';
  rating?: 1|2|3|4|5;
  comment?: string;
  sync_douban?: 0|1;
}) => Promise<DouBan.Interest>

/** 标记影视为已看 */
export const doingMovie: (params: {
  movieID: string;
  type?: DouBan.SubjectType;
  rating?: 1|2|3|4|5;
  comment?: string;
  sync_douban?: 0|1;
}) => Promise<DouBan.Interest>
