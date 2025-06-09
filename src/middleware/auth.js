import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      stellarPublicKey: user.stellarPublicKey
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}; 