const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/app_db';
        await mongoose.connect(mongoURI);
        console.log('MongoDB connection established successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayName: { type: String, required: true },
    profilePic: { type: String }
});

const fileSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    isFolder: { type: Boolean, required: true },
    parentId: { type: String, default: null },
    content: [{ type: String }],
    trashed: { type: Boolean, default: false },
    starred: [{ type: String }],
    timestamp: { type: Date, default: Date.now }
});

const permissionSchema = new mongoose.Schema({
    fileOrDirId: { type: String, required: true, index: true },
    permissions: {
        type: Map,
        of: String
    }
});

const UserModel = mongoose.model('User', userSchema);
const FileModel = mongoose.model('File', fileSchema);
const PermissionModel = mongoose.model('Permission', permissionSchema);

module.exports = {
    connectDB,
    UserModel,
    FileModel,
    PermissionModel
};