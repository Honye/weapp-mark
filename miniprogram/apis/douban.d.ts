declare namespace DouBan {
  /** 搜索结果 */
  interface SearchResult {
    count: number;
    items: Array<SearchMovieItem|SearchDoulistItem|SearchBookItem>;
    total: number;
    start: number;
  }

  /** 搜索结果单项 */
  interface SearchItem {
    type_name: string;
    layout: string;
    target: unknown;
    /**
     * - "tv": 电视剧
     * - "movie": 电影
     * - "doulist_cards": 豆列
     * - "music": 音乐
     * - "game": 游戏
     * - "book": 书籍
     */
    target_type: string;
  }
 
  /** 搜索结果-影视单项 */
  interface SearchMovieItem extends SearchItem {
    layout: 'subject';
    target: Movie;
    target_type: 'tv' | 'movie';
  }

  /** 搜索结果-豆列单项 */
  interface SearchDoulistItem extends SearchItem {
    layout: 'doulist_cards';
    target: {
      doulists: Array<Doulists>
    };
    target_type: 'doulist_cards';
  }

  /** 搜索结果-书籍单项 */
  interface SearchBookItem extends SearchItem {
    layout: 'subject';
    target: Book;
    target_type: 'book';
  }

  interface Subject {
    rating: Rating;
    controversy_reason: string;
    title: string;
    abstract: string;
    uri: string;
    cover_url: string;
    card_subtitle: string;
    id: string;
    null_rating_reason: string;
  }

  type SubjectType = 'movie'|'tv'|'book'|'music';

  interface Movie extends Subject {
    has_linewatch: boolean;
    year: string;
  }

  interface Book extends Subject {
    has_ebook: boolean;
  }

  /** 豆列 */
  interface Doulists {
    cover_url: string;
    id: string;
    image_label: string;
    title: string;
  }

  interface Rating {
    count: number;
    max: number;
    star_count: number;
    value: number;
  }

  interface Actor {
    abstract: string;
    author: string | null;
    avatar: { large: string; normal: string };
    cover_url: string;
    id: string;
    name: string;
    roles: string[];
    sharing_url: string;
    title: string;
    type: 'celebrity';
    uri: string;
    url: string;
  }

  interface Trailer {
    sharing_url: string;
    video_url: string;
    title: string;
    uri: string;
    cover_url: string;
    term_num: number;
    n_comments: number;
    create_time: string;
    subject_title: string;
    file_size: number;
    runtime: string;
    type: string;
    id: string;
    desc: string;
  }

  /** 影视列表单元 */
  interface MovieItem {
    rating: Rating;
    cover: { url: string; width: number; height: number; };
    year: string;
    card_subtitle: string;
    id: string;
    title: string;
    type: SubjectType;
    has_linewatch: boolean;
    most_recent_release_date: string;
    info: string;
    url: string;
    release_date: string;
    original_title: string;
    uri: string;
  }

  interface MovieDetail {
    id: string;
    actors: Actor[];
    aka: string[];
    body_bg_color: string;
    card_subtitle: string;
    comment_count: number;
    directors: Actor[];
    has_linewatch: boolean;
    interest?: Interest;
    linewatches: Array<{
      free: boolean;
      source: {
        literal: string;
        name: string;
        pic: string;
      };
      source_uri: string;
      url: string;
    }>;
    title: string;
    trailer: Trailer;
    type: SubjectType;
  }

  interface User {
    loc: Loc;
    kind: string;
    followed: boolean;
    name: string;
    avatar_side_icon: string;
    url: string;
    gender: string;
    reg_time: string;
    uri: string;
    remark: string;
    in_blacklist: boolean;
    uid: string;
    type: string;
    id: string;
    avatar: string;
  }

  interface Loc {
    uid: string;
    id: string;
    name: string;
  }

  interface Interest {
    comment: string;
    rating?: Rating;
    sharing_url: string;
    is_voted: boolean;
    uri: string;
    platforms: string[];
    vote_count: number;
    create_time: string;
    status: InterestStatus;
    user: User;
    recommend_reason: string;
    user_done_desc: string;
    id: string;
    wechat_timeline_share: 'screenshot';
  }

  interface InterestResult {
    count: number;
    start: number;
    total: number;
    wechat_timeline_share: 'screenshot';
    interests: Interest[]
  }

  type InterestStatus = 'mark'|'doing'|'done';

  interface Image {
    large: ImageMeta;
    raw: string|null;
    small: ImageMeta;
    normal: ImageMeta;
    is_animated: boolean;
  }

  interface ImageMeta {
    url: string;
    width: number;
    size: number;
    height: number;
  }

  interface Photo {
    id: string;
    image: Image;
  }

  interface PhotosResult {
    count: number;
    photos: Photo[];
    total: number;
    start: number;
  }

  interface Trailer {
    reaction_type: number;
    sharing_url: string;
    video_url: string;
    title: string;
    create_time: string;
    uri: string;
    cover_url: string;
    term_num: number;
    n_comments: number;
    reactions_count: number;
    is_collected: boolean;
    subject_title: string;
    collections_count: number;
    file_size: number;
    reshares_count: number;
    runtime: string;
    type: string;
    id: string;
    desc: string;
  }

  interface TrailersResult {
    trailers: Trailer[];
  }

  interface ListParams {
    start?: number;
    count?: number;
  }

  interface ListResult {
    count: number;
    start: number;
    total: number;
  }
}

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
