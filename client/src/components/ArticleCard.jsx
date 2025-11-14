import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ArticleCard({ article }) {
  const { language, t } = useLanguage();
  const title = language === 'vi' ? article.titleVi || article.title : article.title || article.titleVi;
  const description =
    language === 'vi' ? article.shortDescriptionVi || article.shortDescription : article.shortDescription || article.shortDescriptionVi;

  return (
    <article className="article-card">
      {article.thumbnailUrl && (
        <Link to={`/articles/${article.slug}`} className="article-thumb">
          <img src={article.thumbnailUrl} alt={title} loading="lazy" />
        </Link>
      )}
      <div className="article-body">
        <h2>
          <Link to={`/articles/${article.slug}`}>{title}</Link>
        </h2>
        <p className="article-meta">
          {article.author?.fullName && <span>{t('articles.byAuthor', { author: article.author.fullName })}</span>}
          <span>{dayjs(article.publishedAt).isValid() ? dayjs(article.publishedAt).format('DD/MM/YYYY') : ''}</span>
        </p>
        <p>{description}</p>
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
