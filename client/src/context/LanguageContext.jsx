import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LanguageContext = createContext();

const STORAGE_KEY = 'game-advisor-language';

const translations = {
  en: {
    language: {
      english: 'English',
      vietnamese: 'Vietnamese'
    },
    nav: {
      games: 'Games',
      search: 'Advanced Search',
      compare: 'Compare',
      admin: 'Admin',
      login: 'Login',
      loginFailed: 'Login failed',
      logout: 'Logout',
      register: 'Register',
      language: 'Language'
    },
    home: {
      title: 'Featured articles',
      loading: 'Loading articles…',
      error: 'Unable to load articles'
    },
    articles: {
      relatedGame: 'Related game',
      relatedArticles: 'Related articles',
      readMore: 'Read more',
      loading: 'Loading article…',
      notFound: 'Article not found',
      byAuthor: 'By {{author}}',
      generic: 'Article'
    },
    recommendations: {
      title: 'Recommendations',
      loading: 'Loading suggestions…',
      error: 'Unable to load recommendations',
      empty: 'No suggestions yet. Add games to your favourites!'
    },
    auth: {
      loginTitle: 'Login',
      identifier: 'Email or username',
      password: 'Password',
      login: 'Login',
      loggingIn: 'Logging in…',
      registerTitle: 'Create account',
      fullName: 'Full name',
      email: 'Email',
      usernameOptional: 'Username (optional)',
      passwordField: 'Password',
      avatarUrl: 'Avatar URL',
      register: 'Register',
      registering: 'Creating…',
      registerFailed: 'Registration failed'
    },
    profile: {
      title: 'Profile',
      fullName: 'Full name',
      avatar: 'Avatar',
      uploadLabel: 'Upload new avatar',
      avatarTooLarge: 'Avatar image must be smaller than 2 MB',
      save: 'Save changes',
      favorites: 'Favorite games',
      noFavorites: 'No favourites yet. Add some from the game detail pages.',
      remove: 'Remove',
      recentArticles: 'Recently read articles',
      error: 'Unable to update profile'
    },
    buttons: {
      save: 'Save changes',
      removing: 'Removing…'
    },
    comparison: {
      title: 'Game comparison',
      description: 'Enter up to three RAWG IDs to review differences side by side.',
      hint: 'You can find the RAWG ID on each game card in the search results.',
      form: {
        placeholder: 'RAWG ID {{index}}',
        submit: 'Compare',
        submitting: 'Comparing…'
      },
      loading: 'Loading comparison…',
      errors: {
        noId: 'Enter at least one RAWG game ID',
        failed: 'Unable to compare games'
      },
      table: {
        attribute: 'Attribute',
        name: 'Name',
        released: 'Release date',
        rating: 'Rating',
        metacritic: 'Metacritic',
        genres: 'Genres',
        platforms: 'Platforms'
      }
    },
    games: {
      rawgId: 'RAWG ID: {{id}}',
      rating: 'Rating: {{rating}}',
      release: 'Released: {{date}}'
    },
    admin: {
      layout: {
        title: 'Control panel',
        subtitle: 'Keep the content, users, and community in sync.'
      },
      navigation: {
        dashboard: 'Dashboard',
        users: 'Users',
        articles: 'Articles',
        comments: 'Comments'
      },
      dashboard: {
        title: 'Overview',
        subtitle: 'Key stats from your platform at a glance.',
        loading: 'Loading dashboard…',
        error: 'Unable to load dashboard data',
        stats: {
          users: 'Users',
          articles: 'Articles',
          comments: 'Comments'
        },
        topGamesTitle: 'Top games by favourites',
        topGamesCount: '{{count}} favourites',
        topGamesEmpty: 'No favourite data yet.',
        recentArticlesTitle: 'Recent articles',
        recentArticlesEmpty: 'No recent articles.',
        recentCommentsTitle: 'Latest comments',
        recentCommentsEmpty: 'No recent comments.'
      },
      articles: {
        title: 'Manage articles',
        subtitle: 'Create new guides and keep existing content up to date.',
        formTitle: 'New article',
        formSubtitle: 'Provide complete details before publishing.',
        listTitle: 'Existing articles',
        form: {
          title: 'Title',
          shortDescription: 'Short description',
          content: 'Content',
          thumbnailUrl: 'Thumbnail URL',
          relatedGameId: 'Related RAWG ID',
          tags: 'Tags (comma separated)',
          submit: 'Create article',
          submitting: 'Creating…'
        },
        errors: {
          load: 'Unable to load articles',
          create: 'Unable to create article',
          delete: 'Unable to delete article'
        },
        confirmDelete: 'Delete this article?',
        table: {
          title: 'Title',
          tags: 'Tags',
          published: 'Published',
          actions: 'Actions',
          delete: 'Delete'
        },
        empty: 'No articles yet. Start by creating a new post.'
      },
      users: {
        title: 'Manage users',
        subtitle: 'Adjust roles and account status for your community.',
        errors: {
          load: 'Unable to load users',
          update: 'Unable to update user'
        },
        table: {
          name: 'Name',
          email: 'Email',
          role: 'Role',
          status: 'Status'
        },
        roles: {
          user: 'User',
          editor: 'Editor',
          admin: 'Admin'
        },
        status: {
          active: 'Active',
          suspended: 'Suspended'
        },
        empty: 'No users found.'
      },
      comments: {
        title: 'Moderate comments',
        subtitle: 'Filter by target to review and hide inappropriate feedback.',
        errors: {
          load: 'Unable to load comments',
          moderate: 'Unable to moderate comment'
        },
        form: {
          targetPlaceholder: 'Target ID',
          submit: 'Load comments',
          loading: 'Loading comments…'
        },
        filters: {
          game: 'Game',
          article: 'Article'
        },
        actions: {
          hide: 'Hide',
          unhide: 'Unhide'
        },
        empty: 'No comments for this selection.'
      },
      actions: {
        refresh: 'Refresh list'
      }
    },
    notFound: {
      title: 'Not found',
      description: 'The page you are looking for does not exist.',
      cta: 'Go home'
    },
    common: {
      loading: 'Loading…'
    }
  },
  vi: {
    language: {
      english: 'Tiếng Anh',
      vietnamese: 'Tiếng Việt'
    },
    nav: {
      games: 'Trò chơi',
      search: 'Tìm kiếm nâng cao',
      compare: 'So sánh',
      admin: 'Quản trị',
      login: 'Đăng nhập',
      loginFailed: 'Đăng nhập thất bại',
      logout: 'Đăng xuất',
      register: 'Đăng ký',
      language: 'Ngôn ngữ'
    },
    home: {
      title: 'Bài viết nổi bật',
      loading: 'Đang tải bài viết…',
      error: 'Không thể tải bài viết'
    },
    articles: {
      relatedGame: 'Trò chơi liên quan',
      relatedArticles: 'Bài viết liên quan',
      readMore: 'Đọc thêm',
      loading: 'Đang tải bài viết…',
      notFound: 'Không tìm thấy bài viết',
      byAuthor: 'Tác giả {{author}}',
      generic: 'Bài viết'
    },
    recommendations: {
      title: 'Gợi ý cho bạn',
      loading: 'Đang tải gợi ý…',
      error: 'Không thể tải gợi ý',
      empty: 'Chưa có gợi ý nào. Hãy thêm trò chơi yêu thích nhé!'
    },
    auth: {
      loginTitle: 'Đăng nhập',
      identifier: 'Email hoặc tên đăng nhập',
      password: 'Mật khẩu',
      login: 'Đăng nhập',
      loggingIn: 'Đang đăng nhập…',
      registerTitle: 'Tạo tài khoản',
      fullName: 'Họ và tên',
      email: 'Email',
      usernameOptional: 'Tên đăng nhập (không bắt buộc)',
      passwordField: 'Mật khẩu',
      avatarUrl: 'Đường dẫn ảnh đại diện',
      register: 'Đăng ký',
      registering: 'Đang tạo…',
      registerFailed: 'Đăng ký thất bại'
    },
    profile: {
      title: 'Hồ sơ',
      fullName: 'Họ và tên',
      avatar: 'Ảnh đại diện',
      uploadLabel: 'Tải ảnh từ máy',
      avatarTooLarge: 'Ảnh đại diện phải nhỏ hơn 2 MB',
      save: 'Lưu thay đổi',
      favorites: 'Trò chơi yêu thích',
      noFavorites: 'Chưa có trò chơi yêu thích. Hãy thêm từ trang chi tiết nhé.',
      remove: 'Gỡ bỏ',
      recentArticles: 'Bài viết đã đọc gần đây',
      error: 'Không thể cập nhật hồ sơ'
    },
    buttons: {
      save: 'Lưu thay đổi',
      removing: 'Đang gỡ…'
    },
    comparison: {
      title: 'So sánh trò chơi',
      description: 'Nhập tối đa ba ID RAWG để so sánh chi tiết từng mục.',
      hint: 'Bạn có thể tìm ID RAWG ngay trên mỗi thẻ trò chơi trong kết quả tìm kiếm.',
      form: {
        placeholder: 'ID RAWG {{index}}',
        submit: 'So sánh',
        submitting: 'Đang so sánh…'
      },
      loading: 'Đang tải so sánh…',
      errors: {
        noId: 'Vui lòng nhập ít nhất một ID RAWG',
        failed: 'Không thể so sánh trò chơi'
      },
      table: {
        attribute: 'Thuộc tính',
        name: 'Tên',
        released: 'Ngày phát hành',
        rating: 'Điểm đánh giá',
        metacritic: 'Metacritic',
        genres: 'Thể loại',
        platforms: 'Nền tảng'
      }
    },
    games: {
      rawgId: 'ID RAWG: {{id}}',
      rating: 'Đánh giá: {{rating}}',
      release: 'Ngày phát hành: {{date}}'
    },
    admin: {
      layout: {
        title: 'Bảng điều khiển',
        subtitle: 'Quản lý nội dung, người dùng và cộng đồng dễ dàng.'
      },
      navigation: {
        dashboard: 'Tổng quan',
        users: 'Người dùng',
        articles: 'Bài viết',
        comments: 'Bình luận'
      },
      dashboard: {
        title: 'Tổng quan',
        subtitle: 'Các chỉ số quan trọng của nền tảng.',
        loading: 'Đang tải bảng điều khiển…',
        error: 'Không thể tải dữ liệu bảng điều khiển',
        stats: {
          users: 'Người dùng',
          articles: 'Bài viết',
          comments: 'Bình luận'
        },
        topGamesTitle: 'Trò chơi được yêu thích nhất',
        topGamesCount: '{{count}} lượt yêu thích',
        topGamesEmpty: 'Chưa có dữ liệu yêu thích.',
        recentArticlesTitle: 'Bài viết gần đây',
        recentArticlesEmpty: 'Chưa có bài viết nào gần đây.',
        recentCommentsTitle: 'Bình luận mới nhất',
        recentCommentsEmpty: 'Chưa có bình luận mới.'
      },
      articles: {
        title: 'Quản lý bài viết',
        subtitle: 'Tạo bài hướng dẫn mới và cập nhật nội dung hiện có.',
        formTitle: 'Bài viết mới',
        formSubtitle: 'Điền đầy đủ thông tin trước khi xuất bản.',
        listTitle: 'Danh sách bài viết',
        form: {
          title: 'Tiêu đề',
          shortDescription: 'Mô tả ngắn',
          content: 'Nội dung',
          thumbnailUrl: 'Ảnh đại diện',
          relatedGameId: 'ID RAWG liên quan',
          tags: 'Thẻ (ngăn cách bằng dấu phẩy)',
          submit: 'Tạo bài viết',
          submitting: 'Đang tạo…'
        },
        errors: {
          load: 'Không thể tải danh sách bài viết',
          create: 'Không thể tạo bài viết',
          delete: 'Không thể xóa bài viết'
        },
        confirmDelete: 'Bạn có chắc muốn xóa bài viết này?',
        table: {
          title: 'Tiêu đề',
          tags: 'Thẻ',
          published: 'Ngày đăng',
          actions: 'Thao tác',
          delete: 'Xóa'
        },
        empty: 'Chưa có bài viết nào. Hãy bắt đầu tạo bài mới.'
      },
      users: {
        title: 'Quản lý người dùng',
        subtitle: 'Điều chỉnh quyền hạn và trạng thái tài khoản.',
        errors: {
          load: 'Không thể tải danh sách người dùng',
          update: 'Không thể cập nhật người dùng'
        },
        table: {
          name: 'Họ tên',
          email: 'Email',
          role: 'Vai trò',
          status: 'Trạng thái'
        },
        roles: {
          user: 'Người dùng',
          editor: 'Biên tập viên',
          admin: 'Quản trị'
        },
        status: {
          active: 'Hoạt động',
          suspended: 'Đã tạm khóa'
        },
        empty: 'Không tìm thấy người dùng nào.'
      },
      comments: {
        title: 'Kiểm duyệt bình luận',
        subtitle: 'Lọc theo mục tiêu để xem và ẩn bình luận không phù hợp.',
        errors: {
          load: 'Không thể tải bình luận',
          moderate: 'Không thể cập nhật trạng thái bình luận'
        },
        form: {
          targetPlaceholder: 'ID mục tiêu',
          submit: 'Tải bình luận',
          loading: 'Đang tải bình luận…'
        },
        filters: {
          game: 'Trò chơi',
          article: 'Bài viết'
        },
        actions: {
          hide: 'Ẩn',
          unhide: 'Hiện lại'
        },
        empty: 'Không có bình luận nào cho lựa chọn này.'
      },
      actions: {
        refresh: 'Làm mới danh sách'
      }
    },
    notFound: {
      title: 'Không tìm thấy',
      description: 'Trang bạn tìm kiếm hiện không tồn tại.',
      cta: 'Về trang chủ'
    },
    common: {
      loading: 'Đang tải…'
    }
  }
};

function getTranslation(language, key) {
  const segments = key.split('.');
  let current = translations[language] || translations.en;
  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return null;
    }
  }
  return current;
}

function interpolate(value, replacements) {
  if (!replacements) return value;
  return value.replace(/{{(.*?)}}/g, (_, token) => replacements[token.trim()] ?? `{{${token}}}`);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || 'vi');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(() => {
    const translate = (key, replacements) => {
      const raw = getTranslation(language, key) ?? getTranslation('en', key) ?? key;
      if (typeof raw === 'string') {
        return interpolate(raw, replacements);
      }
      return raw;
    };

    return {
      language,
      setLanguage,
      t: translate,
      availableLanguages: [
        { code: 'en', label: translate('language.english') },
        { code: 'vi', label: translate('language.vietnamese') }
      ]
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
