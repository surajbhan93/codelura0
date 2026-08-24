export type Course = {
  _id: string;
  slug: string;
  title: string;

  price: number;
  isPaid: boolean;
  category: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | string;
  language?: string;
  createdAt: string;
  tags?: string[];
  bannerImage?: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  message: string;
  rating: number;
  profileImage?: string;
  category: string;
  createdAt: string;
};

export type FilterType = "all" | "free" | "paid";
export type SortType = "popular" | "newest";