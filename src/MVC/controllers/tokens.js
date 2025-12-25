const User = require('../models/users')

exports.checkUserSignedIn = (req, res) => {
    if (!req.body){
        return res.status(400).json({ error: "Bad Request"})
    }

    try {    // Depart ID and password from the request body
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Bad Request" });
        }

        // Search for the user using the username field
        const user = User.findByUsername(username);

        // Verify if the user exists and the password matches
        if (user && user.password === password) {
            // Return the user ID as a token in the JSON response
            res.status(200).json({ token: user.ID });
        } else {
            // Return 404 if authentication fails
            res.status(404).json({ error: "Not Found" });
        }
    }  catch(err){
        return res.status(500).json({ error: 'Internal Server Error'})
    }
};