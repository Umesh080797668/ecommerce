// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    GOOGLE_AUTH: '/auth/google',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    UPLOAD_AVATAR: '/users/upload-avatar',
    DELETE_ACCOUNT: '/users/delete-account',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    GET_BY_ID: '/posts/:id',
    GET_BY_SLUG: '/posts/slug/:slug',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
    PUBLISH: '/posts/:id/publish',
    UNPUBLISH: '/posts/:id/unpublish',
    LIKE: '/posts/:id/like',
    UNLIKE: '/posts/:id/unlike',
    SHARE: '/posts/:id/share',
  },
  COMMENTS: {
    LIST: '/posts/:postId/comments',
    CREATE: '/posts/:postId/comments',
    UPDATE: '/comments/:id',
    DELETE: '/comments/:id',
    LIKE: '/comments/:id/like',
    UNLIKE: '/comments/:id/unlike',
    APPROVE: '/comments/:id/approve',
    REJECT: '/comments/:id/reject',
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    GET_BY_ID: '/categories/:id',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },
  TAGS: {
    LIST: '/tags',
    CREATE: '/tags',
    GET_BY_ID: '/tags/:id',
    UPDATE: '/tags/:id',
    DELETE: '/tags/:id',
    SEARCH: '/tags/search',
  },
  SEARCH: {
    POSTS: '/search/posts',
    SUGGESTIONS: '/search/suggestions',
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    POST_VIEWS: '/analytics/posts/:id/views',
    USER_ANALYTICS: '/analytics/users',
  },
  UPLOADS: {
    IMAGE: '/uploads/image',
    MULTIPLE: '/uploads/multiple',
    DELETE: '/uploads/:publicId',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    INVALID_USERNAME: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User with this email already exists',
    EMAIL_NOT_VERIFIED: 'Please verify your email address',
    TOKEN_EXPIRED: 'Token has expired',
    INVALID_TOKEN: 'Invalid token',
    ACCESS_DENIED: 'Access denied',
    SESSION_EXPIRED: 'Your session has expired. Please log in again',
  },
  POSTS: {
    POST_NOT_FOUND: 'Post not found',
    UNAUTHORIZED_ACCESS: 'You are not authorized to access this post',
    CANNOT_DELETE_PUBLISHED: 'Cannot delete a published post',
    SLUG_ALREADY_EXISTS: 'A post with this slug already exists',
  },
  COMMENTS: {
    COMMENT_NOT_FOUND: 'Comment not found',
    CANNOT_COMMENT_ON_POST: 'Comments are disabled for this post',
    COMMENT_PENDING_APPROVAL: 'Your comment is pending approval',
  },
  UPLOAD: {
    FILE_TOO_LARGE: 'File size exceeds the maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type',
    UPLOAD_FAILED: 'File upload failed',
  },
  GENERAL: {
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTRATION_SUCCESS: 'Registration successful. Please check your email to verify your account',
    PASSWORD_RESET_SENT: 'Password reset link has been sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password has been reset successfully',
    EMAIL_VERIFIED: 'Email verified successfully',
  },
  POSTS: {
    POST_CREATED: 'Post created successfully',
    POST_UPDATED: 'Post updated successfully',
    POST_DELETED: 'Post deleted successfully',
    POST_PUBLISHED: 'Post published successfully',
    POST_UNPUBLISHED: 'Post unpublished successfully',
  },
  COMMENTS: {
    COMMENT_ADDED: 'Comment added successfully',
    COMMENT_UPDATED: 'Comment updated successfully',
    COMMENT_DELETED: 'Comment deleted successfully',
  },
  UPLOAD: {
    UPLOAD_SUCCESS: 'File uploaded successfully',
    FILES_UPLOADED: 'Files uploaded successfully',
  },
  PROFILE: {
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    AVATAR_UPDATED: 'Avatar updated successfully',
  },
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  USER: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 20,
      PATTERN: /^[a-zA-Z0-9_]+$/,
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  POST: {
    TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 200,
    },
    SLUG: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 200,
      PATTERN: /^[a-z0-9-]+$/,
    },
    EXCERPT: {
      MAX_LENGTH: 500,
    },
    CONTENT: {
      MIN_LENGTH: 100,
      MAX_LENGTH: 50000,
    },
  },
  COMMENT: {
    CONTENT: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 1000,
    },
  },
  CATEGORY: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
    },
  },
  TAG: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 30,
    },
  },
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain'],
  },
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PAGINATION: {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100,
  },
  USER: {
    THEME: 'auto' as const,
    LANGUAGE: 'en',
    AVATAR: '/images/default-avatar.png',
  },
  POST: {
    STATUS: 'draft' as const,
    VISIBILITY: 'public' as const,
    READING_TIME: 200, // words per minute
  },
  ANALYTICS: {
    PERIOD: '30d',
  },
} as const;

// Supported Languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰' },
] as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800,
} as const;

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#64748B',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
} as const;

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  INSTAGRAM: 'instagram',
  GITHUB: 'github',
  WEBSITE: 'website',
} as const;

// File Types
export const FILE_TYPES = {
  IMAGE: 'image',
  DOCUMENT: 'document',
  VIDEO: 'video',
  AUDIO: 'audio',
} as const;