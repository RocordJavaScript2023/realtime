"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import "./loginForm.css";

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/profile";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ email: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      setLoading(false);

      console.log(res);
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("Invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

    const handleRegisterButtonClick = () => {
      if (!loading) {
        router.push("/register");
      }
    };

  return (
    <div className="container">
      <form className="form" onSubmit={onSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="mb-6">
          <input
            required
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email address"
            className="input"
          />
        </div>
        <div className="mb-6">
          <input
            required
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            className="input"
          />
        </div>
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </button>

        <button
          type="button"
          className="button"
          disabled={loading}
          onClick={handleRegisterButtonClick}
        >
          {loading ? "Loading..." : "Register"}
        </button>

        <div className="divider">
          <p>OR</p>
        </div>

        <a
          className="social-button"
          onClick={() => signIn("google")}
          role="button"
        >
          Continue with Google
        </a>
        <a
          className="social-button"
          onClick={() => signIn("github")}
          role="button"
        >
          Continue with GitHub
        </a>
      </form>
    </div>
  );
};
