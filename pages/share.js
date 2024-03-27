import { Button } from "@/components/ui/button";
import Head from "next/head";
import { getById } from "./api/goodwill";
import { useState} from "react"

export default function Share({ data }) {
  const [showMessage, setShowMessage] = useState(false)
  let link = `http://localhost:3000/redeem/${data.ref}`

  let text = `
Hey there! 
I just deposit you a token of appreciation, feel free to redeem it!
Redemption link: 
${link}

Redemption code:
${data.code}
`

  const copyToClipboard = () => {
    setShowMessage(true)
    navigator.clipboard.writeText(text)
    setTimeout(()=>{
      setShowMessage(false)
    },2000)
  }

  return (
    <div>
      <Head>
        <title>Buy you a coffee ☕️</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Buy you a coffee</h1>
        <p>You can now share the redemption link and code to the person 😁</p>
        <p>Redemption link:</p>
        <a href={link}>{link}</a>
        <p>Redemption code:</p>
        <p className="font-bold">{data.code}</p>
        <Button onClick={copyToClipboard}>Copy to clipboard</Button>
        {
          showMessage && <p>Copied to clipboard</p>
        }
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
