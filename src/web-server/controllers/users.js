// controllers/users.js
const User = require('../models/users');

// POST /api/users
exports.createUser = async (req, res) => {
    try {
        if (!req.body){
            return res.status(400).json({ error: "Missing body" });
        }

        const { username, password, displayName, profilePic } = req.body;

        // Check if all required fields are present
        if (!username || !password || !displayName || profilePic === undefined) {
            return res.status(400).json({ error: "Missing args" });
        }

        // Return 404 if the username or password formats are invalid
        const usernameRegex = /^[a-z0-9.]+$/i;
        if (!usernameRegex.test(username)) {
            return res.status(404).json({ error: "Invalid username" });
        }
        if (password.length < 8) {
            return res.status(404).json({ error: "Invalid password" });
        }

        // Check if the username (email) already exists
        // MUST await the database check
        if (await User.findByUsername(username)) {
            // Return 404 for existing user as per your requirements
            return res.status(404).json({ error: "Username already exists" });
        }

        // Create the user and generate the unique UUID inside the model
        // MUST await the creation process
        const newUser = await User.create(username, password, displayName, profilePic);

        // Set the status to 201 (Created), add the Location header with the new ID, and end the response
        // This matches the behavior in the image you provided
        // Using lowercase 'id' as per your updated Model
        res.status(201).location(`/api/users/${newUser.id}`).end();
    } catch(err){
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const ID = req.params.id; // The UUID from the URL
        // finds the user with the given ID
        const user = await User.findByID(ID);

        if (!user) { // check if exists
            return res.status(404).json({ error: "User not found" });
        }

        // For GET, we still return the user details (without the password)
        // Convert Mongoose document to plain object to use destructuring
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    }  catch(err){
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};