import { Nav, Anchor, Header, Text } from "grommet";
import { Announce } from "grommet-icons";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Header background="brand" pad="medium">
        <Link href="/">
          <Text color="accent-1" weight="bold" style={{ cursor: "pointer" }}>
            <a>Zig Zag</a>
          </Text>
        </Link>
        <Nav direction="row">
          <Link href="/new" passHref>
            <Anchor icon={<Announce />} />
          </Link>
        </Nav>
      </Header>
      <main>{children}</main>
    </>
  );
}
