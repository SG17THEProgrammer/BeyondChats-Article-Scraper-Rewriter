import { NavLink } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import axios from "axios"
import { useState } from "react";
import Loader from "./Loader";
const ArticleCard = ({ article }) => {
    const [loading, setLoading] = useState(false)

    // const loadComp = () => {
    //     confetti({
    //         particleCount: 200,
    //         origin:{
    //             x:0,
    //             y:0
    //         } ,
    //         angle:90
    //     });
    // }

    const isUpdated =
        article.title?.toLowerCase().includes("(updated)")



    const runUpdate = async (id) => {
        setLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE}/${id}/rewrite`);
            // console.log(res);
            setTimeout(() => {
                alert("Article updated successfully");
            }, 10000)
        } catch (err) {
            alert("Failed to update article");
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 10000)
        }
    };


    return (
        <>
            <div className="article-card">
                <NavLink to={`/article/${article._id}`} className='navlink'>

                    <h2 className="title">
                        {article.title}
                        {isUpdated && <span className="badge">Updated</span>}
                    </h2>
                </NavLink>

                <p className="excerpt">{article.excerpt}</p>

                <div className="meta">
                    {isUpdated ? "" : <NavLink to={article.url} target="_blank" rel="noreferrer" className='navlink source-badge'>
                        Source
                    </NavLink>}


                    {isUpdated ? "" : <button onClick={() => runUpdate(article._id)} className="rewrite-badge">
                        Rewrite Article
                    </button>}

                    <span >
                        {new Date(article.updatedAt || article.createdAt)
                            .toLocaleDateString("en-IN")}
                    </span>
                </div>

                {/* <div className="content">
        <MarkdownRenderer content={article.content}></MarkdownRenderer>
      </div> */}



                {isUpdated && article.references?.length > 0 && (
                    <div className="references">
                        <h4>References</h4>
                        <ol>
                            {article.references.map((ref, idx) => (
                                <li key={idx}><NavLink className='navlink' to={ref} target="_blank">{ref}</NavLink></li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>
            {loading ? <Loader></Loader>: ""}
        </>
    );
};

export default ArticleCard;
