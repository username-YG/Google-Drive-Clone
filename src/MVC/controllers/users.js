const User = require('../models/users')

// POST /api/users
exports.createUser = (req, res) => {
    const { username, password, displayName, profilePic } = req.body;

    // check if all fields exist
    if (!username || !password || !displayName || !profilePic) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // check if the user already exists
    if (User.findByUsername(username)) {
        return res.status(404).json({ error: "User already exists" });
    }

    const newUser = User.create(username, password, displayName, profilePic);

    // return user without the password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
};

// GET /api/users/:id (כאשר :id הוא ה-username)
exports.getUserById = (req, res) => {
    const username = req.params.id;
    const user = User.findByUsername(username);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
};
