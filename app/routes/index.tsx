import {
  Button,
  Center,
  Checkbox,
  CopyButton,
  NumberInput,
  Stack,
  Title,
} from "@mantine/core";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import generator from "generate-password";

export const loader: LoaderFunction = async ({ params, request }) => {
  const searchParams = new URL(request.url).searchParams;

  const values = {
    size: searchParams.get("size"),
    lowercase: searchParams.get("lowercase") === "null" ? false : true,
    numbers: searchParams.get("numbers") === "null" ? false : true,
    uppercase: searchParams.get("uppercase") === "null" ? false : true,
    symbols: searchParams.get("symbols") === "null" ? false : true,
  };

  if (
    !values.lowercase &&
    !values.numbers &&
    !values.uppercase &&
    !values.symbols
  ) {
    values.lowercase = true;
  }

  return json({
    password: generator.generate({
      length: Number(values.size) || 1,
      ...values,
    }),
  });
};

export const action = async ({ request }: any) => {
  const formData = await request.formData();

  const values = {
    size: formData.get("size"),
    lowercase: formData.get("lowercase"),
    numbers: formData.get("numbers"),
    uppercase: formData.get("uppercase"),
    symbols: formData.get("symbols"),
  };

  const params = new URLSearchParams(values).toString();

  return redirect(`/?${params}`);
};

export default function App() {
  const { password } = useLoaderData<typeof loader>();

  return (
    <>
      <Form method="post">
        <Center style={{ height: "80vh", width: "100%" }}>
          <Stack style={{ width: "300px" }}>
            <Title>Password Generator</Title>

            <Checkbox
              name="uppercase"
              value="uppercase"
              label="Include uppercase letters"
            />
            <Checkbox
              name="lowercase"
              value="lowercase"
              label="Include lowercase letters"
            />
            <Checkbox name="numbers" value="numbers" label="Include numbers" />
            <Checkbox name="symbols" value="symbols" label="Include symbols" />

            <NumberInput name="size" defaultValue={8} label="Select the size" />
            <Button type="submit">Generate!</Button>

            <CopyButton value={password} timeout={2000}>
              {({ copied, copy }) => (
                <Button color={copied ? "teal" : "blue"} onClick={copy}>
                  {copied ? "Copied" : "Copy value"}
                </Button>
              )}
            </CopyButton>
            <Title>{password}</Title>
          </Stack>
        </Center>
      </Form>
    </>
  );
}
