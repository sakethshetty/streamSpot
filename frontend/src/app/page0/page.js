
import { LoginForm } from "@/components/login";
import NavbarComponent from "@/components/navbar";
import VideoList from "@/components/videos";

import Image from "next/image";
import { SignupForm } from "@/components/signup";

export default function Home() {
  return (
    <main className="flex justify-center min-h-screen">
	 
	  <div className="flex flex-col justify-center min-h-screen ">
    <SignupForm/>
	  </div>
    </main>
  );
}
