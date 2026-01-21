import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <header
        style={{
          padding: "22px 40px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>
          CBPUMP
        </div>

        <nav style={{ display: "flex", gap: 22 }}>
          <Link href="/">Home</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/services">Services</Link>
          <Link href="/apply">Apply</Link>
          <Link href="/members">Members</Link>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
