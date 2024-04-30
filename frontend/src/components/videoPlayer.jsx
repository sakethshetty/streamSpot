import { HiOutlineThumbDown } from "react-icons/hi";
import { HiOutlineThumbUp } from "react-icons/hi";
import { Button } from "flowbite-react";
import CommentSection from "./comment";

export default function VideoPlayer({ video }) {
  return (
	<div >
		<div>
	  <video 
	  height="450"
	  width="700"
	  src={video} 
	  controls
	  style={{ marginRight: '30px' }}
	 />
	 </div>
	 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
	  <Button outline pill style={{ marginRight: '30px' }} >
        <HiOutlineThumbUp className="mr-2 h-5 w-5" />
        LIKE
      </Button>
      <Button outline pill>
	  <HiOutlineThumbDown className="mr-2 h-5 w-5"  />
        DISLIKE
      </Button>
	  </div>
	 <div>
	 <CommentSection style={{ marginRight: '100px' }}>
		</CommentSection>
	 </div>
		
	 
	  </div>
	
  );
}
