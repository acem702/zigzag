import { Post } from ".prisma/client";
import { Box, Form, FormField, TextInput, Button } from "grommet";
import type { NextPage } from "next";
import Router from "next/router";
import { useState } from "react";

const NewPost: NextPage = () => {
  const [value, setValue] = useState({ content: "" });

  const handleSubmit = async ({ value: { content } }) => {
    try {
      const body = {
        content,
        authorId: 'ckvsm54ln0023u3hb3idfydku'
      };
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      })
      await Router.push('/feed');
    } catch (error) {
      console.error(error);
    }
    setValue({ content: "" });
  };

  return (
    <Box direction="column" pad="medium">
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onSubmit={handleSubmit}
      >
        <FormField name="content">
          <TextInput placeholder="your post here" name="content" maxLength={200} />
        </FormField>
        <Button type="submit" primary label="Submit" />
      </Form>
    </Box>
  );
};

export default NewPost;
