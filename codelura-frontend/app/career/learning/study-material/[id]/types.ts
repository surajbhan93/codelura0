export type ExternalLink = {
  title: string;
  url: string;
  type: string;
};

export type Course = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  isPaid: boolean;
  accessType: "public_preview" | "login_required" | "paid_only";
  showAdsForFreeUsers: boolean;
  allowDownloadAfterPurchase: boolean;
  category?: string;
  language?: string;
  level?: string;
  duration?: string;
  previewPages?: number;
  tags?: string[];
  attachments?: { fileName: string }[];
  externalLinks?: ExternalLink[];
};

export type ServiceSection = {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  price: number;
  isPaid: boolean;
  features: string[];
  popular?: boolean;
};