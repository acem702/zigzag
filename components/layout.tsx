import { Nav, Anchor, Header, Text } from "grommet";
import { Announce } from "grommet-icons";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <>
      <Header background="brand" pad="medium">
        {/* TODO: unstyle link */}
        <Link href="/">
          <a>Zig Zag</a>
        </Link>
        <Nav direction="row">
          <Link href="/new">
            <Anchor icon={<Announce />} />
          </Link>
        </Nav>
      </Header>
      <main>{children}</main>
    </>
  );
}
