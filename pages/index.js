import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Buy you a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to "Buy you a coffee ☕️"</h1>

        <p>Who do you feel grateful for today?</p>

        <Link href={"/send"}>
          <Button>Send token of appreciation</Button>
        </Link>
      </main>
    </div>
  );
}
