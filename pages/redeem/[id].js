import { Button } from "@/components/ui/button";
import { useState } from "react";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { getById } from "../api/goodwill";

const steps = {
  code: "code",
  codeInvalid: "codeInvalid",
  default: "default",
  phone: "phone",
  success: "success",
};

export default function Redeem({ data }) {
  const [step, setStep] = useState(steps.code);
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");

  const initiateRedemption = () => {
    setStep(steps.code);
  };

  const verifyCode = () => {
    fetch("/api/code", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: data.ref,
        code,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.verified) {
          setStep(steps.phone);
        } else {
          setStep(steps.codeInvalid);
        }
      });
  };

  const initiateTransfer = () => {
    fetch("/api/redemption", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: data.ref,
        code,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setStep(steps.success);
        }
      });
  };

  return (
    <div>
      <Head>
        <title>Gift a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-80 mx-auto mt-10 text-[#591F0B]">
        <div className="text-center mb-10">
          <p className="font-bold">{data.sender_name}</p>
          has{" "}
          {data.appreciation === "buy-you-a-coffee" && (
            <span>bought you a cup of coffee!</span>
          )}
        </div>

        {step === steps.default && (
          <Button onClick={initiateRedemption}>Redeem your coffee</Button>
        )}

        {(step === steps.code || step === steps.codeInvalid) && (
          <div className="space-y-2">
            <p>Redemption code</p>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
            {step === steps.codeInvalid && (
              <p className="text-red-500 text-xs">
                Invalid code, please try again.
              </p>
            )}
            <Button
              className="w-full rounded-full p-8 bg-[#2D0C05] text-[#E8C5A5]"
              onClick={verifyCode}
            >
              Redeem
            </Button>
          </div>
        )}
        {step === steps.phone && (
          <div className="h-min">
            {data.message !== "" && (
              <>
                <div className="rounded-2xl bg-[#C6A989] mt-2 p-4 flex flex-col gap-4 shadow-lg text-wrap w-full relative">
                  <p>{data.message}</p>
                  <p className="text-xs italic">
                    Written by {data.sender_name} on{" "}
                    {new Date(data.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-4 text-sm mt-8">
                  <p>
                    Kindly provide your PayLah! mobile number to complete the
                    redemption.
                  </p>
                  <p>
                    The credit will be transferred into your PayLah! e-Wallet
                    directly.
                  </p>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Button
                    className="w-full rounded-full p-8 bg-[#2D0C05] text-[#E8C5A5]"
                    onClick={initiateTransfer}
                  >
                    Proceed
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
        {step === steps.success && (
          <div className="space-y-2">
            <p>
              Congratulations!{" "}
              <span className="font-bold">{data.receiver_name}</span>
            </p>
            <p>
              You have successfully redeems{" "}
              <span className="font-bold">{data.sender_name}</span>'s token of
              appreciation! 🎉
            </p>
            <p>
              You should receive a transfer from{" "}
              <span className="font-bold">GiftACoffee Pte Ltd</span> within 15
              minutes.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps({ query }) {
  const goodwill = await getById(query.id);

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
