import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CommentsList from "../components/CommentsList";
import AddCommentsForm from "../components/AddCommentForm ";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import useUser from "../hooks/useUser";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({
    upvotes: 0,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const [user, isLoading] = useUser();
  const { articleId } = useParams();

  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.get(`/api/articles/${articleId}`, {
        headers,
      });
      const newArticleInfo = response.data;
      setArticleInfo(newArticleInfo);
    };
    if (isLoading) loadArticleInfo();
  }, [user, isLoading]);

  const addUpvote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      {
        headers,
      }
    );
    const updatedRes = response.data;
    setArticleInfo(updatedRes);
  };

  const updateArticleInfo = (data) => {
    setArticleInfo(data);
  };

  const article = articles.find((article) => article.name === articleId);

  if (!article) return <NotFoundPage />;
  console.log(articleInfo);
  return (
    <>
      <h1>{article.title}</h1>
      <div className="upvotes-section">
        {user ? (
          <button onClick={addUpvote} disabled={!canUpvote}>
            {canUpvote ? "Upvote" : "upvoted"}
          </button>
        ) : (
          <button onClick={addUpvote}>Login to upvote</button>
        )}
        <p> This article has {articleInfo.upvotes} upvots</p>
      </div>

      {article.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {user ? (
        <AddCommentsForm
          onArticleUpdate={updateArticleInfo}
          articleName={articleId}
        />
      ) : (
        <button onClick={addUpvote}>Login to upvote</button>
      )}
      <CommentsList comments={articleInfo.comments} />
    </>
  );
};
export default ArticlePage;
