const User = require('../models/users')

exports.checkUserSignedIn = (req, res) => {
    // Depart ID and password from the request body
    const { ID, password } = req.body;

    if (!ID || !password) {
        return res.status(400).json({ error: "Bad Request" });
    }

    // Search for the user using the ID field
    const user = User.findByID(ID);

    // Verify if the user exists and the password matches
    if (user && user.password === password) {
        // Return the user ID as a token in the JSON response
        res.status(201).json({ token: user.ID });
    } else {
        // Return 404 if authentication fails
        res.status(404).json({ error: "Not Found" });
    }
};