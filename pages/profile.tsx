import type { NextPage } from "next";
import Head from "next/head";
import { Box, Button } from "grommet";
import { signOut } from "next-auth/react";

const Profile: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Profile</title>
      </Head>
      <Box pad="medium">
        <Button label="Sign Out" onClick={() => signOut()} />
      </Box>
    </div>
  );
};

export default Profile;
