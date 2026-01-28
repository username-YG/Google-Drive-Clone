const Search = require('../models/search')
const Users = require("../models/users")

exports.searchFilesAndDirs = async (req, res) => {
    try {
        const query = req.params.query

        const requesterID = req.user.ID;

        // Return 404 if one of the users doesn't exist
        if (!(await Users.findByID(requesterID))) {
            return res.status(404).json({ error: 'Authentication user not found' });
        }

        const files = await Search.getFiles(query, requesterID)
        // retrieving and returning the files and directories
        res.status(200).json(files)
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}