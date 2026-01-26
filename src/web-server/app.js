const express = require('express');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const { connectDB, FileModel } = require('./database');

const filesRoutes = require('./routes/files');
const searchRoutes = require('./routes/search');
const usersRoutes = require('./routes/users');
const tokensRoutes = require('./routes/tokens');

// Start the connection
connectDB();

// Initialize Root Folder dynamically if missing
(async () => {
    try {
        // Check if any folder exists with parentId null
        const root = await FileModel.findOne({ parentId: null });
        if (!root) {
            const rootId = crypto.randomUUID(); // Generate a real UUID
            await new FileModel({
                id: rootId,
                name: '/',
                isFolder: true,
                parentId: null,
                content: [],
                trashed: false,
                starred: [],
                timestamp: new Date()
            }).save();
            console.log(`Root directory initialized with ID: ${rootId}`);
        }
    } catch (err) {
        console.error("Failed to init root:", err);
    }
})();

app.use(cors({ exposedHeaders: ['Location'] }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

app.use('/api/files', filesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tokens', tokensRoutes);

const webPort = +process.argv[4] || 3000;
app.listen(webPort, () => {
    console.log(`Server running on port ${webPort}`);
});