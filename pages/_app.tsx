import type { AppProps } from "next/app";
import { Grommet } from "grommet";

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    }
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Grommet theme={theme} >
      <Component {...pageProps} />
    </Grommet>
  );
}

export default MyApp;
