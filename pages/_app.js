import "../styles/globals.css";
import Link from "next/link";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      {/* Simple navbar on every page */}
      <nav
        style={{
          padding: "16px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link href="/">Home</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/members">Members</Link>
      </nav>

      <Component {...pageProps} />
    </Layout>
  );
}
