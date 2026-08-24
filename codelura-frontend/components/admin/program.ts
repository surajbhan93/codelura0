export interface Lesson {
  _id?: string;
  title: string;
  duration?: string;
  videoUrl?: string;
  isFreePreview?: boolean;
}

export interface Section {
  _id?: string;
  title: string;
  description?: string;
  order?: number;
  lessons: Lesson[];
}

export interface Instructor {
  _id?: string;
  name: string;
  title?: string;
  company?: string;
  image?: string;
  bio?: string;
  highlights?: string[];
}

export interface Review {
  _id?: string;
  userName: string;
  userRole?: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface Program {
  _id: string;
  name: string;
  subtitle?: string;
  slug: string;
  badge?: string;
  shortDescription: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  banner?: string;
  icon?: string;
  color?: string;

  category: "DSA" | "Web Development" | "Backend" | "Other";
  careerTrack?: {
    _id: string;
    title: string;
    slug: string;
    thumbnail?: string;
  } | string;

  price?: number;
  discountPrice?: number;
  platformLink: string;
  clickCount?: number;

  totalHours?: string;
  totalSectionsCount?: number;
  totalStudentsCount?: string;
  includedInSubscription?: boolean;

  sections?: Section[];
  instructors?: Instructor[];
  reviews?: Review[];

  points?: string[];
  skills?: string[];
  tools?: string[];
  technologies?: string[];

  level: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  language?: string;
  certificate?: boolean;
  internship?: boolean;
  placementSupport?: boolean;
  mentorSupport?: boolean;

  tags?: string[];
  faqs?: { question: string; answer: string }[];

  views?: number;
  enrollments?: number;
  rating?: number;
  totalReviews?: number;
  likes?: number;
  shares?: number;
  bookmarks?: number;

  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  recommended?: boolean;
  order?: number;
  status?: "draft" | "published" | "archived";
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProgramListResponse {
  success: boolean;
  data: Program[];
  pagination: Pagination;
}