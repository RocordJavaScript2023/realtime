import { SessionProvider } from "next-auth/react";
import React, { FC } from "react";

export default function App(
    {
  Component,
  pageProps: { session, ...pageProps },} : {
    Component: FC,
    pageProps: any
  }
  
  ) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
