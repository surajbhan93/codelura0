import { COMPANY_DETAILS } from '../constants';

export default function GoogleMap() {
  return (
    <iframe
      title="Codelura Technologies Location Map - Noida Sector 62"
      src={COMPANY_DETAILS.googleMapEmbedUrl}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen={false}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-full rounded-3xl opacity-90 hover:opacity-100 transition-opacity"
    />
  );
}
