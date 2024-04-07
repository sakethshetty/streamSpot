
import { LoginForm } from "@/components/login";
import NavbarComponent from "@/components/navbar";
import VideoList from "@/components/videos";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex justify-center min-h-screen">
	  <NavbarComponent />
	  <div className="flex flex-col justify-center min-h-screen ">
      <LoginForm />
	  <VideoList/>
	  </div>
    </main>
  );
}
