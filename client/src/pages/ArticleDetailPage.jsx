import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import { fetchArticle, markArticleAsRead } from '../services/articleApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import CommentSection from '../components/CommentSection.jsx';
import GameCard from '../components/GameCard.jsx';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedGame, setRelatedGame] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
        setError('Unable to load article');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug, user?._id]);

  const html = useMemo(() => {
    if (!article) return '';
    const rawHtml = marked.parse(article.content || '');
    return DOMPurify.sanitize(rawHtml);
  }, [article]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading article…</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="page">
        <p className="error">{error || 'Article not found'}</p>
      </div>
    );
  }

  return (
    <div className="page article-detail">
      <article>
        <header className="article-header">
          <h1>{article.title}</h1>
          <p className="article-meta">
            {article.author?.fullName && <span>By {article.author.fullName}</span>}
            <span>{dayjs(article.publishedAt).format('DD/MM/YYYY')}</span>
          </p>
          {article.thumbnailUrl && <img src={article.thumbnailUrl} alt={article.title} />}
        </header>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
      </article>

      {relatedGame && (
        <section className="related-game">
          <h2>Related game</h2>
          <GameCard game={relatedGame} />
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section>
          <h2>Related articles</h2>
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
  return (
    <div className="article-summary">
      <h3>{article.title}</h3>
      <p>{article.shortDescription}</p>
      <Link to={`/articles/${article.slug}`} className="btn-link">
        Read more
      </Link>
    </div>
  );
}
