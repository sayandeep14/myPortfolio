export type PostType = "article" | "link" | "movie" | "music" | "book";

export interface Post {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  link_url?: string;
  og_title?: string;
  og_desc?: string;
  og_image?: string;
  og_domain?: string;
  youtube_url?: string;
  youtube_video_id?: string;
  artist?: string;
  song_title?: string;
  book_author?: string;
  book_amazon_url?: string;
  book_cover_url?: string;
  movie_year?: number;
  movie_rating?: number;
  movie_genre?: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  is_anonymous: boolean;
  name?: string;
  email?: string;
  hint?: string;
  message: string;
  read: boolean;
  created_at: string;
}
