// export const trackPurchase = (amount: number, courseName: string) => {
//   if (typeof window !== "undefined" && window.gtag) {
//     window.gtag("event", "purchase", {
//       transaction_id: Date.now().toString(),
//       value: amount,
//       currency: "INR",
//       items: [
//         {
//           item_name: courseName,
//           price: amount,
//           quantity: 1
//         }
//       ]
//     });
//   }
// };