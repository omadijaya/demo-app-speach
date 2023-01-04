import Head from "next/head";
import SpeechToText from "../components/SpeechToText";

export default function Home() {
  return (
    <div className="home">
      <Head>
        <title>Demo Aplikasi OJ</title>
        <meta
          name="description"
          content="Demo aplikasi untuk mencocokan suara dengan text yang ada."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Demo Aplikasi Speach Matching</h1>

      <main>
        <SpeechToText />
      </main>
    </div>
  );
}
