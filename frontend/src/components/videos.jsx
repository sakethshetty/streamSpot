import React from 'react';

const videos = [
  {
    id: 1,
    title: 'Video 1',
    description: 'Description for Video 1',
    url: 'https://www.example.com/video1.mp4'
  },
  {
    id: 2,
    title: 'Video 2',
    description: 'Description for Video 2',
    url: 'https://www.example.com/video2.mp4'
  },
  // Add more video objects as needed
];

function VideoList() {
  return (
    <div>
      {videos.map(video => (
         <div key={video.id} style={{ width: '150%', margin: 'auto', textAlign: 'left' }}>
          <h2>{video.title}</h2>
          <video controls style={{ width: '100%', marginBottom: '10px' }}>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>{video.description}</p>
        </div>
      ))}
    </div>
  );
}

export default VideoList;
