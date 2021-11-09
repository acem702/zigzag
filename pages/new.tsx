import { Box, Form, FormField, TextInput, Button } from "grommet";
import type { NextPage } from "next";
import { useState } from "react";

const NewPost: NextPage = () => {
  const [value, setValue] = useState({ text: ''});

  const handleSubmit = ({ value }: { value: { text: string } }) => {
    console.log(value.text);
    setValue({ text: ''})
  };

  return (
    <Box direction="column">
      <Form
        value={value}
        onChange={(nextValue) => setValue(nextValue)}
        onSubmit={handleSubmit}
      >
        <FormField name="text" label="New post">
          <TextInput placeholder="your post here" name="text" maxLength={200} />
        </FormField>
        <Button type="submit" primary label="Submit" />
      </Form>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </Box>
  );
};

export default NewPost;
