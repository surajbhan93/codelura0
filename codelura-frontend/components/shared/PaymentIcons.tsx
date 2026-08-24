const payments = [
  { src: "/footer/googlepay.svg", alt: "Google Pay" },
  { src: "/footer/paytm.svg", alt: "Paytm" },
  { src: "/footer/paypal.svg", alt: "PayPal" },
  { src: "/footer/visa.svg", alt: "Visa" },
  { src: "/footer/mastercard.svg", alt: "Mastercard" },
  { src: "/footer/apple.svg", alt: "Apple Pay" },
];

export default function PaymentIcons() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-wider text-slate-500 text-center">
        100% SECURE PAYMENT
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {payments.map((payment) => (
          <div
            key={payment.alt}
            className="w-[72px] h-[48px] bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm"
          >
            <img
              src={payment.src}
              alt={payment.alt}
              width={52}
              height={30}
              loading="lazy"
              className="max-w-[52px] max-h-[30px] object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}