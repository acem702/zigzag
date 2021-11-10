import type { NextPage } from "next";
import Head from "next/head";
import { Box } from "grommet";
import Link from 'next/link';

const Login: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box>Login
        <Link href="/api/auth/signin">Log in</Link>
      </Box>
    </div>
  );
};

export default Login;
