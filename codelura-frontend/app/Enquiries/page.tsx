import { Suspense } from "react";
import ContactForm from "./ContactForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}