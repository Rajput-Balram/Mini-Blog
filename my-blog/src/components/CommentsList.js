const CommentsList = ({ comments }) => {
  console.log(comments);

  return (
    <>
      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div className="comment" key={Comment.postedBy + ": " + Comment.text}>
          <h4>Auther : {comment.postedBy}</h4>
          <p>{comment.text}</p>
        </div>
      ))}
    </>
  );
};
export default CommentsList;
