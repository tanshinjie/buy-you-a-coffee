import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <Head>
        <title>Gift a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Oops! The link you are requesting are not found.</h1>

        <Link href={"/"}>
          Back to home
        </Link>
      </main>
    </div>
  );
}
