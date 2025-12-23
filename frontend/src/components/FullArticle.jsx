import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import MarkdownRenderer from "../components/MarkdownRenderer";
import axios from "axios";

const FullArticle = () => {

  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/${id}`);
        console.log(res);
        setArticle(res.data);
      } catch (err) {
        console.error("Failed to fetch article", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading article...</p>;
  if (!article) return <p>Article not found</p>;

  const isUpdated =
    article.title?.toLowerCase().includes("(updated)")

  return (
    <div className="full-article">
      <NavLink to="/" className="back-link badge">← Back to articles</NavLink>

      <h1>
        {article.title}
        {isUpdated && <span className="badge">Updated</span>}
      </h1>

      <MarkdownRenderer content={article.content} />

      {isUpdated && article.references?.length > 0 && (
        <div className="references">
          <h3>References</h3>
          <ul>
            {article.references.map((ref, idx) => (
              <li key={idx}>{ref}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FullArticle;
