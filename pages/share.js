import { Button } from "@/components/ui/button";
import Head from "next/head";
import { getById } from "./api/goodwill";
import { useState } from "react";

export default function Share({ data }) {
  const [showMessage, setShowMessage] = useState(false);
  // let link = `http://localhost:3000/redeem/${data.ref}`;
  let link = `http://192.168.10.58:3000/redeem/${data.ref}`;

  let text = `
Hey there! 
I just bought you a coffee, feel free to redeem it!
Redemption link: 
${link}

Redemption code:
${data.code}
`;

  const copyToClipboard = async () => {
    setShowMessage(true);
    try {
      await _copyToClipboard(text);
      // navigator.clipboard.writeText(text);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Head>
        <title>Gift a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-80 mx-auto mt-10 text-[#591F0B]">
        <p>You can now share the redemption link and code to the person! 😁</p>
        <div className="rounded-2xl bg-[#C6A989] mt-4 p-8 flex flex-col gap-4 shadow-lg text-wrap w-full">
          <div>
            <p>Redemption link</p>
            <a className="font-bold break-words" href={link} target="_blank">
              {link}
            </a>
          </div>
          <div>
            <p>Redemption code</p>
            <p className="font-bold">{data.code}</p>
          </div>
        </div>
        <p className="my-4 text-sm">
          P.S. The credits will be automatically refunded to you if it is not
          redeemed after 3 days.
        </p>
        <Button
          className="w-full rounded-full p-8 bg-[#2D0C05] text-[#E8C5A5]"
          onClick={copyToClipboard}
        >
          {showMessage ? "Copied to clipboard" : "Copy to clipboard"}
        </Button>
      </main>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps({ query }) {
  const goodwill = await getById(query.ref);

  if (goodwill.length === 0) {
    return {
      redirect: {
        destination: "/not-found",
        permanent: false,
      },
    };
  }

  return {
    props: {
      notFound: false,
      data: goodwill[0],
    },
  };
}

async function _copyToClipboard(textToCopy) {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(textToCopy);
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";

    document.body.prepend(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
    } catch (error) {
      console.error(error);
    } finally {
      textArea.remove();
    }
  }
}
