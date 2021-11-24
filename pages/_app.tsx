import type { AppProps } from "next/app";
import Head from "next/head";
import { Grommet } from "grommet";
import Layout from "../components/layout";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

const theme = {
  global: {
    font: {
      family: "Inter, sans-serif",
      size: "18px",
      height: "20px",
    },
    body: {
      margin: "0",
    },
  },
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Grommet theme={theme} full>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Grommet>
    </SessionProvider>
  );
}

export default MyApp;
