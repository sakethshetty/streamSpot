"use client";
import NavbarComponent from "@/components/navbar";
import VideoPlayer from "@/components/videoPlayer";
import VideosSideList from "@/components/videosSideList";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login";

import { SignupForm } from "@/components/signup";
import Image from "next/image";
import { Account } from "@/components/account";
export default function Player() {
  // get video url from query string

  const videos_data = [
    {
      id: 1,
      title: "Video 1",
      url: "https://www.youtube.com/watch?v=1",
    },
    {
      id: 2,
      title: "Video 2",
      url: "https://www.youtube.com/watch?v=2",
    },
    {
      id: 3,
      title: "Video 3",
      url: "https://www.youtube.com/watch?v=3",
    },
    {
      id: 4,
      title: "Video 4",
      url: "https://www.youtube.com/watch?v=4",
    },
  ];
  const params = useSearchParams();
  const videoUrl = params.get("videoUrl");
  console.log(videoUrl);
  return (
    <>
      <NavbarComponent />
      <div className="w-[90%] m-auto md:flex justify-between">
        <VideoPlayer videoUrl={videoUrl} />
        <VideosSideList videos={videos_data} />
      </div>
    </>
  );
}
