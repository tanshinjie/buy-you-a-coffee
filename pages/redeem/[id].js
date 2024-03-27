import { Button } from "@/components/ui/button";
import { useState } from "react";
import Head from "next/head";
import { Input } from "@/components/ui/input";
import { getById } from "../api/goodwill";

const steps = {
  default: "default",
  code: "code",
  codeInvalid: "codeInvalid",
  phone: "phone",
  success: "success",
};

export default function Redeem({ data }) {
  const [step, setStep] = useState(steps.default);
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
        <title>Buy you a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          {data.name} would like to{" "}
          {data.appreciation === "buy-you-a-coffee" && (
            <span>“Buy you a coffee”</span>
          )}
        </h1>

        <p>{data.message}</p>

        {step === steps.default && (
          <Button onClick={initiateRedemption}>Redeem</Button>
        )}

        {step === steps.code && (
          <div>
            <p>Kindly provide the redemption code for verification</p>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
            <Button onClick={verifyCode}>Verify</Button>
          </div>
        )}
        {step === steps.codeInvalid && (
          <div>
            <p>Kindly provide the redemption code for verification</p>
            <p className="text-red-500">Invalid code, please try again.</p>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
            <Button onClick={verifyCode}>Verify</Button>
          </div>
        )}
        {step === steps.phone && (
          <div>
            <p>
              Kindly provide your PayLah! phone number to complete the
              redemption. The money will be transferred into your PayLah!
              eWallet directly.
            </p>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Button onClick={initiateTransfer}>Redeem</Button>
          </div>
        )}
        {step === steps.success && (
          <p>
            You have successfully redeems{" "}
            <span className="font-bold">{data.name}</span>'s token of
            appreciation! You should receive a transfer from{" "}
            <span className="font-bold">GoodWill Pte Ltd</span> within 15 minutes.
          </p>
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
