export default function VideoPlayer({ video }) {
  return (
	<div>
	  <video 
	  height="450"
	  width="700"
	  src={video} 
	  controls />
	</div>
  );
}
