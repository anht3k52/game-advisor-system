import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function ArticleCard({ article }) {
  return (
    <article className="article-card">
      {article.thumbnailUrl && (
        <Link to={`/articles/${article.slug}`} className="article-thumb">
          <img src={article.thumbnailUrl} alt={article.title} loading="lazy" />
        </Link>
      )}
      <div className="article-body">
        <h2>
          <Link to={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        <p className="article-meta">
          {article.author?.fullName && <span>By {article.author.fullName}</span>}
          <span>{dayjs(article.publishedAt).isValid() ? dayjs(article.publishedAt).format('DD/MM/YYYY') : ''}</span>
        </p>
        <p>{article.shortDescription}</p>
        {article.tags?.length > 0 && (
          <div className="tag-list">
            {article.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
