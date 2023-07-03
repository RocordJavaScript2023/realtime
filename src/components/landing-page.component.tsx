"use client";

import { useSession } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";
import beehive from "./../animations/beehive-loader.json";

export default function LandingPage() {
  const router: AppRouterInstance = useRouter();

  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main>
        <div className="loading-spinner-wrapper">
          <Lottie
            play
            loop
            animationData={beehive}
            style={{ width: 400, height: 400 }}
          />
        </div>
      </main>
    );
  } else if (status == "unauthenticated") {
    router.push("/login");
    return (<></>);
  } else {
    router.push("/chats");
    return(<></>);
  }
}
