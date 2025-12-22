const User = require('../models/users')

// POST /api/users
exports.createUser = (req, res) => {
    const { ID : ID, password, displayName, profilePic } = req.body;

    // check if all fields exist
    if (!ID || !password || !displayName || !profilePic) {
        return res.status(400).json({ error: "Bad Request" });
    }

    // check if the user already exists
    if (User.findByID(ID)) {
        return res.status(404).json({ error: "Not Found" });
    }

    const newUser = User.create(ID, password, displayName, profilePic);

    // return user without the password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
};

// GET /api/users/:id
exports.getUserById = (req, res) => {
    const ID = req.params.id;
    const user = User.findByID(ID);

    if (!user) {
        return res.status(404).json({ error: "Not Found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
};