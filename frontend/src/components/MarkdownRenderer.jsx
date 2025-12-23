import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h3: ({ node, ...props }) => (
          <h3 className="md-heading" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="md-paragraph" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="md-list-item" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="md-strong" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
