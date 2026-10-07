import api from "./api";

export interface ReferralCommentItem {
  _id: string;
  referralId?: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured?: boolean;
  isAdminAdded?: boolean;
  createdAt: string;
}

export interface ReferralCommentStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: Record<number, number>;
}

export const getPublicReferralComments = async (): Promise<{
  comments: ReferralCommentItem[];
  stats: ReferralCommentStats;
}> => {
  const res = await api.get("/referral-comments");
  return res.data;
};

export const postStudentReferralComment = async (payload: {
  rating: number;
  comment: string;
  userRole?: string;
  referralId?: string;
}) => {
  const res = await api.post("/referral-comments", payload);
  return res.data;
};

export const getAdminReferralComments = async (): Promise<ReferralCommentItem[]> => {
  const res = await api.get("/referral-comments/admin");
  return res.data.comments || [];
};

export const adminAddReferralComment = async (payload: {
  userName: string;
  userAvatar?: string;
  userRole?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  isFeatured?: boolean;
}) => {
  const res = await api.post("/referral-comments/admin", payload);
  return res.data;
};

export const adminToggleApprovedReferralComment = async (id: string) => {
  const res = await api.patch(`/referral-comments/admin/${id}/approve`);
  return res.data;
};

export const adminDeleteReferralComment = async (id: string) => {
  const res = await api.delete(`/referral-comments/admin/${id}`);
  return res.data;
};
