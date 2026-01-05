const User = require('../models/users')
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET;

// POST /api/tokens
exports.processLogin = (req, res) => {
    if (!req.body){
        return res.status(400).json({ error: "Missing body" });
    }

    try {    // Depart ID and password from the request body
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Missing args" });
        }

        // Search for the user using the username field
        const user = User.findByUsername(username);

        // Verify if the user exists and the password matches
        if (user && user.password === password) {
            // Generate a JWT token
            const token = jwt.sign(
                {
                    username: user.username,
                    ID: user.ID
                },
                key
            )

            // Return the token in the JSON response
            res.status(201).json({ token });
        } else {
            // Return 404 if authentication fails
            res.status(404).json({ error: "User not found" });
        }
    }  catch(err) {
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};

// Middleware to check if user is logged in
exports.isLoggedIn = (req, res, next) => {
    if (!req.headers) {
        return res.status(400).json({ error: "Missing headers" });
    }

    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                // Verify the token
                const data = jwt.verify(token, key);
                // If token is valid, proceed to the request handler
                // Attach user data to request object
                req.user = data;
                return next()
            } catch (err) {
                // Return 401 for invalid token
                return res.status(401).send({error: "Invalid Token"});
            }
        }
        else
            // Return 403 if no authorization header present
            return res.status(403).send({error: 'Token required'});
    } catch(err) {
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};