"use client";

import { SignInResponse, signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * "use client";
 * 
 * This is a Custom Login Form.
 * 
 * This Component is rendered client-side.
 * 
 * The reason behind this being, that all 
 * Components in the `app` directory are
 * Server-Side by default.
 * 
 * We will therefore not have access to certain
 * browser APIs and React hooks, including those needed 
 * for form validation.
 * 
 * To work around this, we need to render the component
 * on the client-side.
 * 
 * hence, "use client";
 * 
 * @returns JSX.Element
 */
export const LoginForm = () => {

  const router = useRouter();

  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false);

  const [formValues, setFormValues]: [
    { email: string; password: string },
    Dispatch<SetStateAction<{ email: string; password: string }>>
  ] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // This allows us to access the URL params.
  // so if URL contains ?foo=bar we can use searchParams.get('foo') ==> and get 'bar'
  const searchParams = useSearchParams();

  /**
   * We need to check if the `callbackUrl` parameter has been aded to the URL 
   * by NextAuth. 
   * 
   * If it's present, we need to extract it and store it in a variable.
   * This allows us to dynamically redirect the user to the appropriate page
   * after successful authentication, rather than hardcoding a specific URL.
   */
  const callbackUrl = searchParams?.get("callBackUrl") || "/profile";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      // display a loading spinner on the button  
      setLoading(true);

      // track the state of the form values.
      setFormValues({ email: "", password: "" });

      // Here we try to sign in 
      const response: SignInResponse | undefined = await signIn("Local", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      // remove the loading spinner again
      setLoading(false);

      console.log(response);

      // If the response from the signIn attempt was successful
      // So, no errors ==> redirect the user to the callbackUrl
      if (!response?.error) {
        router.push(callbackUrl);
      } else {
        // Set the Error state to be displayed
        setError("invalid email or password");
      }
    } catch (error: any) {
      // Risky Move, but oh well...
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <p className="error-box">{error}</p>}
      <div className="login-form">
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="email"
        />
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="password"
        />
        <button
            type="submit"
            disabled={loading}>{loading ? "loading..." : "Sign In" }</button>
      </div>
      <a
        role="button"
        onClick={() => signIn("github")}>Sign in with Github
        </a>
      <a
        role="button"
        onClick={() => signIn("discord")}>Sign in with Discord</a>
    </form>

  );
};
