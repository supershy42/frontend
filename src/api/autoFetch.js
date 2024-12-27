import { navigate } from '../router.jsx';

let isRefreshing = false;
let failedQueue = [];

// 토큰 갱신 후 실패한 요청들 재처리
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const autoFetch = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('access');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, options);

    if ((response.status === 401)) {
      // 이미 토큰 갱신 중이면 현재 요청을 대기열에 추가
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          // 갱신된 토큰으로 다시 요청
          options.headers['Authorization'] = `Bearer ${token}`;
          return autoFetch(url, options);
        });
      }
      isRefreshing = true;

      try {
        // 리프레시 토큰으로 엑세스 토큰 갱신
        const refreshResponse = await fetch(`${USER_API_URL}/refresh/`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!refreshResponse.ok) {
          throw new Error('Refresh token expired');
        }

        const newToken = await refreshResponse.json();
        localStorage.setItem('access', newToken.access);

        // 갱신된 토큰으로 실패한 요청들 재처리
        processQueue(null, newToken.access);

        // 현재 요청 재시도
        options.headers['Authorization'] = `Bearer ${newToken.access}`;
        return autoFetch(url, options);
      } catch (error) {
        processQueue(error, null);

        // 토큰 갱신 실패, 리프레시 토큰도 만료된 경우
        localStorage.removeItem('access');
        document.cookie =
          'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login');
        throw error;
      } finally {
        isRefreshing = false;
      }
    }

    // 일반 에러
    if (!response.ok) {
      throw await response.json();
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export default autoFetch;