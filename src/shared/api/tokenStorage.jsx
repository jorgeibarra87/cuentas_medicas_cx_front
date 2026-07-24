const ACCESS_KEY = "tokenhusjp";
const REFRESH_KEY = "tokenhusjp_refresh";

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const setAccessToken = (t) => localStorage.setItem(ACCESS_KEY, t);
export const removeAccessToken = () => localStorage.removeItem(ACCESS_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setRefreshToken = (t) => localStorage.setItem(REFRESH_KEY, t);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_KEY);

export const clearTokens = () => {
    removeAccessToken();
    removeRefreshToken();
};

export const decodeJwt = (token) => {
    try {
        if (!token) return {};
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload || {};
    } catch {
        return {};
    }
};

export const getTokenPayload = () => {
    const token = getAccessToken();
    if (!token) return {};
    const payload = decodeJwt(token);
    if (!payload || Object.keys(payload).length === 0) {
        clearTokens();
    }
    return payload;
};