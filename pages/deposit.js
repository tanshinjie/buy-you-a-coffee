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

  // useEffect(()=>{
  //   fetch(`/api/approval-request?ref=${router.query.ref}`, {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((response) => {
  //       if (response.approved) {
  //         setStep(steps.deposit_verified);
  //       }
  //     });
  // },[])

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
              router.push(`/share?ref=${router.query.ref}`)
            }
          });
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [step]);

  // let payNowString = paynowGenerator(
  //   "mobile",
  //   "83642124",
  //   "no",
  //   5,
  //   "GiftACoffee Pte Ltd",
  //   router.query.ref
  // );
  // console.log("[DEBUG] payNowString",payNowString)

  let queryString = encodeURI(
    `mobile=83642124&uen=&editable=0&amount=5&expiry=${getExpiry()}&ref_id=${
      router.query.ref
    } GiftACoffee Pte Ltd&company=`
  );

  return (
    <div>
      <Head>
        <title>Gift a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-80 mx-auto mt-10 text-[#591F0B]">
        <p>
          Kindly deposit your coffee credit to generate a unique redeemable
          link.
        </p>
        <p>
          Your unique reference number is{" "}
          <span className="font-bold">{router.query.ref}</span>.
        </p>
        <img className="w-60 m-auto my-4" src={`https://sgqrcode.com/paynow?${queryString}`} />

        {step === steps.deposit_verified && (
          <Badge className="bg-green-600">Success</Badge>
        )}
        {step === steps.deposit && (
          <Button className="w-full rounded-full p-8 bg-[#2D0C05] text-[#E8C5A5]" onClick={triggerDepositVerification}>Generate link</Button>
        )}
        {step === steps.deposit_approval_pending && (
          <p className="text-sm font-light text-center mt-8">Verifying deposit... It may takes up to 1 minutes, please do not close this window.</p>
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
