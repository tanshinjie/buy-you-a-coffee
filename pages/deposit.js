import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { paynowGenerator } from "paynow-generator";
import QRCode from "qrcode.react";

const steps = {
  deposit: "deposit",
  deposit_approval_pending: "deposit_approval_pending",
  deposit_verified: "deposit_verified",
};

export default function Deposit() {
  const router = useRouter();

  const [step, setStep] = useState(steps.deposit);

  const triggerDepositVerification = () => {
    setStep(steps.deposit_approval_pending);
    fetch("/api/approval-request", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: router.query.ref,
      }),
    })
      .then((res) => res.json())
      .then((_) => {
        setStep(steps.deposit_approval_pending)
      });
  };

  useEffect(() => {
    let interval;
    if (step === steps.deposit_approval_pending) {
      interval = setInterval(() => {
        fetch(`/api/approval-request?ref=${router.query.ref}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.approved) {
              setStep(steps.deposit_verified);
            }
          });
      }, 3000);
    } else if (step === steps.deposit_verified) {
      setTimeout(() => router.push(`/share?ref=${router.query.ref}`, 1000));
    }

    return () => clearInterval(interval);
  }, [step]);

  // let payNowString = paynowGenerator(
  //   "mobile",
  //   "83642124",
  //   "no",
  //   5,
  //   "GoodWill Pte Ltd",
  //   router.query.ref
  // );
  // console.log("[DEBUG] payNowString",payNowString)

  let queryString = encodeURI(
    `mobile=83642124&uen=&editable=0&amount=5&expiry=${getExpiry()}&ref_id=${
      router.query.ref
    } (GoodWill Pte Ltd)&company=`
  );

  return (
    <div>
      <Head>
        <title>Buy you a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Buy you a coffee</h1>
        <p>
          Please deposit SGD 5 into the deposit account. Kindly include the
          unique identifier{" "}
          <span className="font-bold">{router.query.ref}</span> under the
          reference area.
        </p>
        <p>
          You can scan the QR code on screen to access deposit account (GoodWill
          Pte Ltd).
        </p>
        <img src={`https://sgqrcode.com/paynow?${queryString}`} />

        {step === steps.deposit_verified && (
          <Badge className="bg-green-600">Success</Badge>
        )}
        {step === steps.deposit && (
          <Button onClick={triggerDepositVerification}>Deposit complete</Button>
        )}
        {step === steps.deposit_approval_pending && (
          <p>Pending approval... Please give it a few minutes</p>
        )}
      </main>
    </div>
  );
}

function getExpiry() {
  // Get current date and time
  let currentDate = new Date();

  // Add one day to the current date
  currentDate.setDate(currentDate.getDate() + 1);

  // Format the date into "YYYY/MM/DD HH:MM" format
  let formattedDate =
    currentDate.getFullYear() +
    "/" +
    ("0" + (currentDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + currentDate.getDate()).slice(-2) +
    " " +
    ("0" + currentDate.getHours()).slice(-2) +
    ":" +
    ("0" + currentDate.getMinutes()).slice(-2);
  return formattedDate;
}
