import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";

const AddCommentsForm = ({ onArticleUpdate, articleName }) => {
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const [user] = useUser();

  const addComment = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const comment = { postedBy: name, text: text };
    const response = await axios.post(
      `/api/articles/${articleName}/comments`,
      comment,
      {
        headers,
      }
    );
    const updatedComment = response.data;
    onArticleUpdate(updatedComment);
    setName("");
    setText("");
  };

  return (
    <div className="add-comment-form">
      {user && <p>You are posting as: {user.email}</p>}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
      />

      <button type="submit" onClick={addComment}>
        Add Comment
      </button>
    </div>
  );
};
export default AddCommentsForm;
