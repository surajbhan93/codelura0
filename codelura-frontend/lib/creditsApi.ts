import api from "./api";

export interface CreditWallet {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
  freeTrialClaimed?: boolean;
}

export interface CreditPackage {
  _id: string;
  name: string;
  price: number;
  credits: number;
  badge?: string;
  isActive?: boolean;
}

export interface CreditTransaction {
  _id: string;
  type: "PURCHASE" | "REFERRAL_UNLOCK" | "REFUND" | "ADMIN_CREDIT" | "ADMIN_DEBIT";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  referralId?: {
    _id: string;
    title: string;
    company: string;
    slug: string;
  };
}

export const getCreditWallet = async (): Promise<CreditWallet> => {
  const res = await api.get("/credits/wallet");
  return res.data.wallet;
};

export const claimFreeTrial = async () => {
  const res = await api.post("/credits/claim-free-trial");
  return res.data;
};

export const getFreeTrialStatus = async () => {
  const res = await api.get("/credits/free-trial-status");
  return res.data;
};

export const getCreditHistory = async (page = 1, limit = 10) => {
  const res = await api.get(`/credits/history?page=${page}&limit=${limit}`);
  return res.data;
};

export const getCreditPackages = async (): Promise<CreditPackage[]> => {
  const res = await api.get("/credits/packages");
  return res.data.packages || [];
};

export const createCreditOrder = async (packageId: string) => {
  const res = await api.post("/credits/create-order", { packageId });
  return res.data;
};

export const verifyCreditPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  packageId: string;
}) => {
  const res = await api.post("/credits/verify-payment", payload);
  return res.data;
};

export const unlockReferral = async (referralId: string) => {
  const res = await api.post(`/credits/referral/${referralId}/unlock`);
  return res.data;
};

export const getMyUnlockedReferrals = async () => {
  const res = await api.get("/credits/my-unlocked-referrals");
  return res.data.referrals || [];
};
