"use client";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({
  className,
}: LogoutButtonProps) {
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={className}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "11px 18px",
        fontSize: "0.875rem",
        color: "#ef4444",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "background 0.15s",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#fef2f2")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "none")
      }
    >
      <span style={{ fontSize: "16px" }}>👋</span> Logout
    </button>
  );
}