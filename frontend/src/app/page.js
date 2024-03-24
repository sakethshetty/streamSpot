
import { LoginForm } from "@/components/login";
import NavbarComponent from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex justify-center min-h-screen">
	  <NavbarComponent />
	  <div className="flex flex-col justify-center min-h-screen ">
      <LoginForm />
	  </div>
    </main>
  );
}
