'use client';

export default function GoogleMap() {
  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-800">
      <iframe
        title="Codelura Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3602.3!2d81.8349!3d25.4520!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI3JzA3LjIiTiA4McKwNTAnMDUuNiJF!5e0!3m2!1sen!2sin!4v1234567890"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
