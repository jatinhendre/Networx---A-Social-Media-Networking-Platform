import User from '../models/users.model.js';

const getBearerToken = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : null;
};

export const getTokenFromRequest = (req) => {
  return (
    req.body?.token ||
    req.query?.token ||
    getBearerToken(req.headers?.authorization) ||
    null
  );
};

export const resolveUserFromToken = async (token) => {
  if (!token) return null;
  return User.findOne({ token });
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const user = await resolveUserFromToken(token);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.authToken = token;
    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({
      message: 'Authentication failed',
      error: error.message,
    });
  }
};

