function VideoSideItem({ video }) {
  return (
    <a className="md:w-52"href={`/player?videoUrl=${video.url}`}>
      <div className="p-5 md:p-1 w-fit m-auto">
        <img src="https://via.placeholder.com/250" />
        <div>{video.title}</div>
      </div>
    </a>
  );
}

export default function VideosSideList({ videos}) {
  return (
    <div className="m-auto md:mr-0 text-center md:w-fit">
      {videos.map((video) => (
        <VideoSideItem
          key={video.id}
          video={video}
        />
      ))}
    </div>
  );
}
