import { games } from '../data/games.js';

const SCORE_WEIGHTS = {
  genre: 3,
  platform: 2,
  budget: 1,
  playStyle: 2,
  rating: 1
};

export function recommendByPreferences(preferences = {}, options = {}) {
  const {
    favoriteGenres = [],
    preferredPlatforms = [],
    budget,
    playStyles = []
  } = preferences;

  const limit = options.limit || 5;

  const scored = games.map((game) => {
    let score = 0;

    if (favoriteGenres.includes(game.genre)) {
      score += SCORE_WEIGHTS.genre;
    }

    const platformMatch = game.platform.some((p) => preferredPlatforms.includes(p));
    if (platformMatch) {
      score += SCORE_WEIGHTS.platform;
    }

    if (typeof budget === 'number' && game.price <= budget) {
      score += SCORE_WEIGHTS.budget;
    }

    const styleMatch = game.tags.some((tag) => playStyles.includes(tag));
    if (styleMatch) {
      score += SCORE_WEIGHTS.playStyle;
    }

    score += (game.rating / 5) * SCORE_WEIGHTS.rating;

    return { ...game, score };
  });

  return scored
    .filter((game) => game.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function recommendSimilarGames(gameId, options = {}) {
  const target = games.find((game) => game.id === gameId);
  if (!target) return [];

  const limit = options.limit || 3;

  return games
    .filter((game) => game.id !== gameId)
    .map((game) => {
      let similarity = 0;

      if (game.genre === target.genre) {
        similarity += 3;
      }

      const platformOverlap = game.platform.filter((platform) =>
        target.platform.includes(platform)
      );
      similarity += platformOverlap.length;

      const sharedTags = game.tags.filter((tag) => target.tags.includes(tag));
      similarity += sharedTags.length * 0.5;

      similarity -= Math.abs(game.price - target.price) * 0.02;

      return { ...game, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}
