import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <Form action="../google/auth" method="post">
      <button>Login with Google</button>
    </Form>
  );
}
