import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

const Home: NextPage = () => {
  return (
    <Container>
      <h1>Home</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente iure,
        eius nostrum necessitatibus quis possimus.
      </p>
      <Button>Click here</Button>
    </Container>
  );
};

export default Home;
