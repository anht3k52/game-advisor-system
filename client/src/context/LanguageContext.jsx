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
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en');

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
