const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

const loginAttempts = new Map();

export const loginRateLimit = (req, res, next) => {
  const clientId = req.ip;
  const now = Date.now();
  const currentAttempt = loginAttempts.get(clientId);

  const attempt =
    !currentAttempt || currentAttempt.resetAt <= now
      ? { count: 0, resetAt: now + LOGIN_WINDOW_MS }
      : currentAttempt;

  const retryAfterSeconds = Math.ceil((attempt.resetAt - now) / 1000);

  res.set({
    'RateLimit-Limit': MAX_LOGIN_ATTEMPTS,
    'RateLimit-Remaining': Math.max(MAX_LOGIN_ATTEMPTS - attempt.count - 1, 0),
    'RateLimit-Reset': retryAfterSeconds
  });

  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    res.set('Retry-After', retryAfterSeconds);

    return res.status(429).json({
      message: 'Too many login attempts. Please try again later.'
    });
  }

  attempt.count += 1;
  loginAttempts.set(clientId, attempt);

  return next();
};
