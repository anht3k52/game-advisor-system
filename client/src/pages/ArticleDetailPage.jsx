import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import { fetchArticle, markArticleAsRead } from '../services/articleApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentSection from '../components/CommentSection.jsx';
import GameCard from '../components/GameCard.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedGame, setRelatedGame] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchArticle(slug);
        setArticle(data.article);
        setRelatedGame(data.relatedGame);
        setRelatedArticles(data.relatedArticles || []);
        if (data.article && user) {
          markArticleAsRead(data.article._id).catch(() => {});
        }
      } catch (err) {
        console.error(err);
        setError(t('articles.notFound'));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug, user?._id, t]);

  const html = useMemo(() => {
    if (!article) return '';
    const content = language === 'vi' ? article.contentVi || article.content : article.content || article.contentVi;
    const rawHtml = marked.parse(content || '');
    return DOMPurify.sanitize(rawHtml);
  }, [article, language]);

  if (loading) {
    return (
      <div className="page">
        <p>{t('articles.loading')}</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="page">
        <p className="error">{error || t('articles.notFound')}</p>
      </div>
    );
  }

  const title = language === 'vi' ? article.titleVi || article.title : article.title || article.titleVi;

  return (
    <div className="page article-detail">
      <article>
        <header className="article-header">
          <h1>{title}</h1>
          <p className="article-meta">
            {article.author?.fullName && <span>{t('articles.byAuthor', { author: article.author.fullName })}</span>}
            <span>{dayjs(article.publishedAt).format('DD/MM/YYYY')}</span>
          </p>
          {article.thumbnailUrl && <img src={article.thumbnailUrl} alt={title} />}
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {relatedGame && (
        <section className="related-game">
          <h2>{t('articles.relatedGame')}</h2>
          <GameCard game={relatedGame} />
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section>
          <h2>{t('articles.relatedArticles')}</h2>
          <div className="article-grid">
            {relatedArticles.map((item) => (
              <ArticleSummary key={item._id || item.slug} article={item} />
            ))}
          </div>
        </section>
      )}

      <CommentSection targetType="article" targetId={article._id} />
    </div>
  );
}

function ArticleSummary({ article }) {
  const { language, t } = useLanguage();
  const title = language === 'vi' ? article.titleVi || article.title : article.title || article.titleVi;
  const description =
    language === 'vi'
      ? article.shortDescriptionVi || article.shortDescription
      : article.shortDescription || article.shortDescriptionVi;

  return (
    <div className="article-summary">
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={`/articles/${article.slug}`} className="btn-link">
        {t('articles.readMore')}
      </Link>
    </div>
  );
}
