import Head from "next/head";
import Header from "../components/Header";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  return (
    <>
      <Head>
        <title>Weather Agent Chat — Pazago</title>
        <meta name="description" content="Frontend assignment — Weather Agent Chat Interface" />
      </Head>
      <Header />
      <main className="p-4">
        <ChatWindow />
      </main>
    </>
  );
}
