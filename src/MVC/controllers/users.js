// controllers/users.js
const User = require('../models/users');

// POST /api/users
exports.createUser = (req, res) => {
    try {
        if (!req.body){
            return res.status(400).json({ error: "Bad Request"})
        }

        const { username, password, displayName, profilePic } = req.body;

        // Check if all required fields are present
        if (!username || !password || !displayName || !profilePic) {
            return res.status(400).json({ error: "Bad Request" });
        }

        // Check if the username (email) already exists
        if (User.findByUsername(username)) {
            // Return 404 for existing user as per your requirements
            return res.status(404).json({ error: "Not Found" });
        }

        // Create the user and generate the unique UUID inside the model
        const newUser = User.create(username, password, displayName, profilePic);

        // Set the status to 201 (Created), add the Location header with the new ID, and end the response
        // This matches the behavior in the image you provided
        res.status(201).location(`/api/users/${newUser.ID}`).end();
    } catch(err){
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};

// GET /api/users/:id
exports.getUserById = (req, res) => {
    try {
        const ID = req.params.id; // The UUID from the URL
        const user = User.findByID(ID); // finds the user with the given ID

        if (!user) { // check if exists
            return res.status(404).json({ error: "Not Found" });
        }

        // For GET, we still return the user details (without the password)
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    }  catch(err){
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};