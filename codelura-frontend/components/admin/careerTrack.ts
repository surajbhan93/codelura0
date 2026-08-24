export interface RoadmapStep {
  title: string;
  description: string;
  duration: string;
  order: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CareerTrack {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  badge?: string;
  shortDescription?: string;
  description?: string;
  thumbnail?: string;
  banner?: string;
  icon?: string;
  color?: string;

  price?: number;
  discountPrice?: number;
  totalHours?: string;
  totalProjects?: number;
  salaryRange?: string;
  hiringPartners?: string[];
  perks?: string[];

  instructors?: {
    _id?: string;
    name: string;
    title?: string;
    company?: string;
    image?: string;
    bio?: string;
    highlights?: string[];
  }[];

  learningPathTitle?: string;
  learningPathDescription?: string;
  roadmap?: RoadmapStep[];
  courses?: {
    _id: string;
    name: string;
    slug: string;
    thumbnail?: string;
    price?: number;
    discountPrice?: number;
    level?: string;
  }[];
  category?: { _id: string; name: string; slug: string } | string;

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

  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;

  tags?: string[];
  faqs?: Faq[];

  views?: number;
  uniqueVisitors?: number;
  enrollments?: number;
  completedStudents?: number;
  certificatesIssued?: number;
  likes?: number;
  shares?: number;
  bookmarks?: number;
  rating?: number;
  totalReviews?: number;

  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  recommended?: boolean;
  order?: number;
  status: "draft" | "published" | "archived";
  publishedAt?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CareerTrackListResponse {
  success: boolean;
  data: CareerTrack[];
  pagination: Pagination;
}

export interface CareerTrackSingleResponse {
  success: boolean;
  data: CareerTrack;
  message?: string;
}