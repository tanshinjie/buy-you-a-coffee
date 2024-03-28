import { Button } from "@/components/ui/button";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Gift a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

       <main className="max-w-80 mx-auto mt-10">
        <div className="flex flex-col gap-40 ">
          <p className="text-[#591F0B] my-8 text-center">Who do you feel grateful for today? 😊</p>
          <Link href={"/send"}>
            <Button className="w-full rounded-full p-8 bg-[#2D0C05] text-[#E8C5A5]">Buy him/her coffee today!</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
