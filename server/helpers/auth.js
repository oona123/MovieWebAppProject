import jwt from "jsonwebtoken";
const { verify } = jwt;

// Error messages
const authorizationRequired = "Authorization required";
const invalidCredentials = "Invalid credentials";

// Middleware to authenticate JWT tokens
const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.statusMessage = authorizationRequired;
    return res.status(401).json({ message: authorizationRequired });
  }

  try {
    // Remove "Bearer " prefix if present
    const decoded = verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);

    // Attach user information to request object
    req.user = decoded;
    
    next();
  } catch (err) {
    res.statusMessage = invalidCredentials;
    return res.status(403).json({ message: invalidCredentials });
  }
};

export { auth };