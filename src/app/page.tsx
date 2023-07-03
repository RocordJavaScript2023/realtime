import { Inter } from "next/font/google";
import "@/components/css/app.css";
import LandingPage from "@/components/landing-page.component";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  return (
    <LandingPage/>
  );
}
