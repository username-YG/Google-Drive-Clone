const Search = require('../models/search')

exports.searchFilesAndDirs = async (req, res) => {
    try {
        const query = req.params.query

        // checking validity of the arguments
        if (!req.headers || !req.headers['x-user-id']) {
            return res.status(400).json({ error: "Bad Request" })
        }

        const requesterID = req.headers['x-user-id']

        const files = await Search.getFiles(query, requesterID)
        // retrieving and returning the files and directories
        res.status(200).json(files)
    } catch(err) {
        return res.status(500).json({ error : "Internal Server Error" })
    }
}