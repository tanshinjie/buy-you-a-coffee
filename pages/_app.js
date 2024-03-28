// These styles apply to every route in the application
import "@/styles/global.css";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [stats, setStats] = useState({
    approved_total: 1543,
    redeemed_total: 909,
  });
  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      fetch(`/api/stats`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((response) => {
          setStats({
            approved_total:
              response.stats.approved_total + stats.approved_total,
            redeemed_total:
              response.stats.redeemed_total + stats.redeemed_total,
          });
        });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen bg-orange-100 overflow-y-scroll">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>

      </Head>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="bg-[#DEAC77] text-center py-6 text-3xl text-[#591F0B] font-light">
            <a href="/">Gift a Coffee ☕️</a>
          </div>

          <Component {...pageProps} />
        </div>
        <footer className="w-full text-center max-w-96 mx-auto sticky bottom-0">
          <div className="grid grid-cols-2 text-sm my-4 text-[#482312] font-light">
            {stats && (
              <>
                <div>
                  <span className="font-bold">{stats.approved_total}</span> cups
                  gifted.
                </div>
                <div>
                  <span className="font-bold">{stats.redeemed_total}</span> cups
                  redeemed.
                </div>
              </>
            )}
          </div>
          <p className="text-sm text-[#B88A56] margin-auto font-light pb-4">
            The world is a better place with a cup of coffee ❤️
          </p>
        </footer>
      </div>
    </div>
  );
}
