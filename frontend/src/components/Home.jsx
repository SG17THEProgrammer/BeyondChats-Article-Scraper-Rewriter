import React, { useEffect, useState } from "react";
import { fetchArticles } from "../api/articles";
import ArticleList from "../components/ArticleList";
import Tabs from "../components/Tabs";

const isUpdatedArticle = (article) =>
  article.title?.toLowerCase().includes("(updated)")  

const Home = () => {
  const [activeTab, setActiveTab] = useState("original");
  const [originalArticles, setOriginalArticles] = useState([]);
  const [updatedArticles, setUpdatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then((res) => {
        const originals = [];
        const updated = [];

        res.data.forEach((article) => {
          isUpdatedArticle(article)
            ? updated.push(article)
            : originals.push(article);
        });

        setOriginalArticles(originals);
        setUpdatedArticles(updated);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading articles...</p>;

  return (
    <div className="container">
      <h1>Article Dashboard</h1>

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "original" ? (
        <ArticleList articles={originalArticles} />
      ) : (
        <ArticleList articles={updatedArticles} />
      )}
    </div>
  );
};

export default Home;
