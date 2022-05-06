declare namespace Douban {
  interface SubjectCollection {
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
  }

  /** 榜单合集 */
  interface SubjectCollectionItemsResult {
    count: number;
    subject_collection: SubjectCollection;
    subject_collection_items: DouBan.MovieItem[];
    total: number;
    start: number;
  }

  /** 影院热映 */
  interface SubjectCollectionShowingItemsResult {
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
  }

  /** 即将上映 */
  interface SubjectCollectionSoonItemsResult {
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
  }

  interface UserInterestsResult {
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
  }
}
