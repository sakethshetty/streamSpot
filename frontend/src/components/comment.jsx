import React, { useState } from 'react';
import { Badge } from "flowbite-react";

const CommentSection = () => {
  // State to hold comments
  const [comments, setComments] = useState([]);
  // State to hold new comment text
  const [newComment, setNewComment] = useState('');

  // Function to handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div>
      <Badge color="info" size="sm">
        Comments
      </Badge>
      {/* Display existing comments */}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
      {/* Input field for new comment */}
      <div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={4}
          cols={50}
        />
      </div>
      {/* Button to add new comment */}
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default CommentSection;
