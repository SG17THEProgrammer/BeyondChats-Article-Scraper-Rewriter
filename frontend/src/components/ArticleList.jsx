import ArticleCard from "./ArticleCard";

const ArticleList = ({ articles, isUpdated }) => {
  if (!articles.length) return <p>No articles found.</p>;

  return (
    <div className="article-grid">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
          isUpdated={isUpdated}
        />
      ))}
    </div>
  );
};

export default ArticleList;
