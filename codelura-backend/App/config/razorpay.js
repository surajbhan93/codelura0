import Razorpay from "razorpay";

export const getRazorpay = () => {
  const key_id = (
    process.env.RAZORPAY_KEY_ID || "rzp_test_S8BjiwOqvmp8HX"
  ).trim();
  const key_secret = (
    process.env.RAZORPAY_KEY_SECRET || "xwHQcoDAMzZX2RVb2WgirkTM"
  ).trim();

  return new Razorpay({
    key_id,
    key_secret,
  });
};

const razorpay = getRazorpay();

export default razorpay;