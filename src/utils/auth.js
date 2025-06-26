// Authentication and request management utilities

const AUTH_KEY = 'guardianneuro_auth';
const REQUEST_COUNT_KEY = 'guardianneuro_requests';
const MAX_REQUESTS = 50;

// Authentication functions
export const isAuthenticated = () => {
    return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = () => {
    localStorage.setItem(AUTH_KEY, 'true');
};

export const logout = () => {
    localStorage.removeItem(AUTH_KEY);
};

// Request counting functions
export const getRequestCount = () => {
    const count = localStorage.getItem(REQUEST_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
};

export const getRemainingRequests = () => {
    return Math.max(0, MAX_REQUESTS - getRequestCount());
};

export const incrementRequestCount = () => {
    const currentCount = getRequestCount();
    const newCount = currentCount + 1;
    localStorage.setItem(REQUEST_COUNT_KEY, newCount.toString());
    return newCount;
};

export const canMakeRequest = () => {
    return getRemainingRequests() > 0;
};

export const getMaxRequests = () => {
    return MAX_REQUESTS;
};

// Reset function (for development/testing purposes)
export const resetRequestCount = () => {
    localStorage.removeItem(REQUEST_COUNT_KEY);
};
