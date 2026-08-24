// app/premium/[slug]/BuyButton.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';

const BuyModal = dynamic(
  () => import('@/components/premium/BuyModal'),
  { 
    loading: () => <div className={styles.modalLoader}>Loading...</div>,
    ssr: false 
  }
);

export default function BuyButton({ plan, large = false }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const shouldOpen = localStorage.getItem("openBuyModal");
    const token = localStorage.getItem("token");
    if (shouldOpen === "true" && token && token !== "undefined" && token !== "null") {
      setShowModal(true);
      localStorage.removeItem("openBuyModal");
    }
  }, []);

  const handleBuy = () => {
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token && token !== "undefined" && token !== "null";

    if (!isLoggedIn) {
      localStorage.setItem("openBuyModal", "true");
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <button 
        className={large ? styles.ctaMainBtn : styles.btnPrimary} 
        onClick={handleBuy}
      >
        {large ? "Join Premium Now" : "Buy Now"}
      </button>
      {showModal && (
        <BuyModal
          plan={plan}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}