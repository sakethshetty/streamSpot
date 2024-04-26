import NavbarComponent from "@/components/navbar";

export default function Home() {
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
  return (
    <main className="min-h-screen">
      <NavbarComponent />
		<h1 className="text-3xl font-bold">Videos</h1>
	  <div className="justify-evenly md:flex  w-[70%] m-auto text-center">
			{videos_data.map((video) => (
			  <div key={video.id} className="bg-gray-200 p-4 m-4 sm:flex justify-between md:block">
				<img src="https://via.placeholder.com/150" alt="video" className="m-auto"/>
				<div>
				<h2 className="text-xl font-bold">{video.title}</h2>
				<a href={`/player?videoUrl=${video.url}`} target="_blank" className="text-blue-500">
				  Watch Video
				</a>
				</div>
			  </div>
			))}
	  </div>

    </main>
  );
}
