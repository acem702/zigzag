import { Post } from ".prisma/client";
import { Box, Form, FormField, TextInput, Button } from "grommet";
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { useState } from "react";
import { usePosition } from "use-position";

const NewPost: NextPage = () => {
  const [value, setValue] = useState({ content: "" });
  const { latitude, longitude } = usePosition(false);

  const handleSubmit = async ({
    value: { content },
  }: {
    value: { content: string };
  }) => {
    try {
      const body = {
        content,
        latitude,
        longitude,
      };
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await Router.push("/");
    } catch (error) {
      console.error(error);
    }
    setValue({ content: "" });
  };

  return (
    <Box direction="column" pad="medium">
      <Head>
        <title>New Post</title>
      </Head>
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onSubmit={handleSubmit}
      >
        <FormField name="content">
          <TextInput
            placeholder="your post here"
            name="content"
            maxLength={200}
          />
        </FormField>
        <Button type="submit" primary label="post" />
      </Form>
    </Box>
  );
};

export default NewPost;
