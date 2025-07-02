// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isEmailVerified: boolean;
  preferences: UserPreferences;
  socialLinks?: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  ADMIN = 'admin',
  AUTHOR = 'author'
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletter: boolean;
}

export interface SocialLinks {
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
  website?: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  images?: string[];
  status: PostStatus;
  visibility: PostVisibility;
  author: User;
  categories: Category[];
  tags: Tag[];
  seoData: SEOData;
  analytics: PostAnalytics;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled'
}

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PASSWORD_PROTECTED = 'password_protected'
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  image?: string;
  parentId?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface PostAnalytics {
  views: number;
  uniqueViews: number;
  likes: number;
  shares: number;
  comments: number;
  averageReadTime: number;
  bounceRate: number;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  replies: Comment[];
  likes: number;
  dislikes: number;
  isApproved: boolean;
  isSpam: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Search Types
export interface SearchQuery {
  q: string;
  categories?: string[];
  tags?: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: PostStatus;
}

export interface SearchResult {
  posts: BlogPost[];
  total: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  authors: { name: string; count: number }[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  NEW_COMMENT = 'new_comment',
  NEW_LIKE = 'new_like',
  NEW_FOLLOWER = 'new_follower',
  POST_PUBLISHED = 'post_published',
  SYSTEM_UPDATE = 'system_update'
}

// Analytics Types
export interface AnalyticsData {
  period: string;
  totalViews: number;
  uniqueViews: number;
  totalPosts: number;
  totalComments: number;
  totalUsers: number;
  topPosts: { post: BlogPost; views: number }[];
  viewsByDate: { date: string; views: number }[];
  popularCategories: { category: Category; views: number }[];
}

// Upload Types
export interface UploadResponse {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  size: number;
}