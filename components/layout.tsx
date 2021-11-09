import { Nav } from "grommet";

export default function Layout({ children }) {
  return (
    <>
      <Nav background="brand" pad="medium">Zig Zag</Nav>
      <main>{children}</main>
    </>
  );
}
