const { verify } = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const requireAuth = (resolver) => {
    return async (parent, args, context, info) => {
        const token = context.req.cookies?.accessToken;

        if (!token) {
            throw new Error('Not authenticated');
        }

        try {
            const decoded = verify(token, JWT_SECRET);
            context.user = decoded; // Add the decoded user info to the context for easy access
            return await resolver(parent, args, context, info);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    };
};

module.exports = requireAuth;