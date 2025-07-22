import jwt from 'jsonwebtoken';
import compression from 'compression';
import config from '../config/config.js';

const protect = (req, res, next) => {
    // const token = req.cookies.token;
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token)
        return res.status(401).json({ message: 'Access Denied: No token provided' });

    try {
        const decoded = jwt.verify(token, config.jwtSecret || 'mysecretkey');
        req.user = decoded; // payload from the token
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default protect;
