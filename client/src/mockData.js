export const mockUsers = [
  {
    id: 'u1',
    name: 'Minh Tran',
    email: 'minh@example.com',
    preferences: {
      favoriteGenres: ['RPG', 'Adventure'],
      preferredPlatforms: ['PC'],
      budget: 60,
      playStyles: ['story-rich', 'co-op']
    }
  },
  {
    id: 'u2',
    name: 'Linh Pham',
    email: 'linh@example.com',
    preferences: {
      favoriteGenres: ['Strategy', 'Simulation'],
      preferredPlatforms: ['PC', 'Nintendo Switch'],
      budget: 40,
      playStyles: ['tactical', 'casual']
    }
  }
];

export const mockGames = [
  {
    id: 'g1',
    title: 'Legends of Eldoria',
    genre: 'RPG',
    platform: ['PC', 'PlayStation'],
    rating: 4.8,
    tags: ['open-world', 'fantasy', 'story-rich'],
    releaseYear: 2023,
    price: 59.99,
    playModes: ['Singleplayer'],
    description: 'Epic fantasy adventure với thế giới mở rộng lớn và cốt truyện nhánh.'
  },
  {
    id: 'g2',
    title: 'Velocity Drift',
    genre: 'Racing',
    platform: ['PC', 'Xbox'],
    rating: 4.2,
    tags: ['multiplayer', 'competitive', 'sports'],
    releaseYear: 2021,
    price: 49.99,
    playModes: ['Singleplayer', 'Multiplayer'],
    description: 'Đua xe tốc độ cao với vật lý chân thực và giải đấu online.'
  },
  {
    id: 'g3',
    title: 'Starbound Tactics',
    genre: 'Strategy',
    platform: ['PC', 'Nintendo Switch'],
    rating: 4.5,
    tags: ['tactical', 'sci-fi', 'turn-based'],
    releaseYear: 2022,
    price: 39.99,
    playModes: ['Singleplayer', 'Multiplayer'],
    description: 'Chỉ huy hạm đội trong các trận chiến thiên hà với chiến thuật sâu sắc.'
  },
  {
    id: 'g4',
    title: 'Mystic Manor',
    genre: 'Adventure',
    platform: ['PC', 'PlayStation', 'Xbox'],
    rating: 4.0,
    tags: ['puzzle', 'narrative', 'co-op'],
    releaseYear: 2020,
    price: 29.99,
    playModes: ['Singleplayer', 'Co-op'],
    description: 'Khám phá dinh thự huyền bí với cơ chế giải đố hợp tác độc đáo.'
  }
];

export const mockComments = [
  {
    id: 'c1',
    gameId: 'g1',
    userId: 'u1',
    userName: 'Minh Tran',
    rating: 5,
    content: 'Một thế giới mở rộng lớn và cốt truyện cực kỳ hấp dẫn!',
    createdAt: '2023-10-02T10:00:00.000Z'
  },
  {
    id: 'c2',
    gameId: 'g2',
    userId: 'u2',
    userName: 'Linh Pham',
    rating: 4,
    content: 'Game đua xe cạnh tranh, rất đáng thử cùng bạn bè.',
    createdAt: '2023-11-12T08:30:00.000Z'
  }
];

export const mockBroadcasts = [];
