declare namespace DouBan {
  interface SearchResult {
    count: number;
    items: Array<SearchMovieItem|SearchBookItem>;
    total: number;
    start: number;
  }

  interface SearchMovieItem {
    type_name: string;
    layout: 'subject';
    target: Movie;
    target_type: 'tv' | 'movie';
  }

  interface SearchBookItem {
    type_name: string;
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

  interface Movie extends Subject {
    has_linewatch: boolean;
    year: string;
  }

  interface Book extends Subject {
    has_ebook: boolean;
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

  interface MovieDetail {
    actors: Actor[];
    aka: string[];
    body_bg_color: string;
    card_subtitle: string;
    directors: Actor[];
    title: string;
    trailer: Trailer;
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
    status: string;
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
  id: string
}) => Promise<DouBan.MovieDetail>

/** 短评列表 */
export const getInterests: (params: {
  id: string
  start: number
  count: number
  status?: 'done'
}) => Promise<DouBan.InterestResult>

/** 剧照 */
export const getPhotos: (params: {
  id: string;
  start: number;
  count: number;
}) => Promise<DouBan.PhotosResult>

/** 预告片列表 */
export const getTrailers: (params: {
  id: string;
}) => Promise<DouBan.TrailersResult>

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
    type: 'movie'
    most_recent_release_date: string
    info: string
    url: string
    release_date: string
    original_title: string
    uri: string
  }>
}>