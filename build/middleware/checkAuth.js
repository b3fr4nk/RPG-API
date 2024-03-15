"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const checkAuth = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({
            message: "You must be logged in to do this.",
        });
    }
    try {
        // Verify the token using your secret key
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        // Attach the decoded token to the request object
        req.user = decoded;
        // Proceed to the next middleware
        next();
    }
    catch (error) {
        console.error.bind(console, `Error in authorization middleware: ${error}`);
        return res.status(403).json({ message: "Authorization failed.", error });
    }
};
exports.checkAuth = checkAuth;
