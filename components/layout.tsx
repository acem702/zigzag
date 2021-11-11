import { Nav, Anchor, Header, Text } from "grommet";
import { Announce, User } from "grommet-icons";
import Link from "next/link";
import { ReactNode } from "react";
import { signIn, useSession } from "next-auth/react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const { data: session, status } = useSession();

  return (
    <>
      <Header background="brand" pad="medium">
        <Link href="/">
          <Text color="accent-1" size="large" weight="bold" style={{ cursor: "pointer" }}>
            <a>Zig Zag</a>
          </Text>
        </Link>
        <Nav direction="row">
          {status === "authenticated" ? (
            <>
              <Link href="/new" passHref>
                <Anchor icon={<Announce />} />
              </Link>
              <Link href="/profile" passHref>
                <Anchor icon={<User />} />
              </Link>
            </>
          ) : (
            <Text
              onClick={() => signIn("google")}
              color="accent-1"
              style={{ cursor: "pointer" }}
            >
              Sign in
            </Text>
          )}
        </Nav>
      </Header>
      <main>{children}</main>
    </>
  );
}
