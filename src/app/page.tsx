"use client";

import { Inter } from "next/font/google";
import Lottie from "react-lottie-player";
import beehive from "@/animations/beehive-loader.json";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import "@/components/css/app.css";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const session = useSession();

  const router: AppRouterInstance = useRouter();

  if (session.status === "loading") {
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
  } else if (session.status === "unauthenticated") {
    router.push("/login");
  } else {
    router.push("/chats");
  }
}
