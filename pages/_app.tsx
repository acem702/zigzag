import type { AppProps } from "next/app";
import { Grommet } from "grommet";
import Layout from "../components/layout";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

const theme = {
  global: {
    font: {
      family: "Roboto",
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
      <Grommet theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Grommet>
    </SessionProvider>
  );
}

export default MyApp;
