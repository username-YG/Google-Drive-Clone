// models/users.js
const crypto = require('crypto');
const { UserModel } = require('../database');

// const users = [];

class User {

    // Static method to find a user by ID
    static async findByID(id) {
        return await UserModel.findOne({ id });
    }

    // Static method to find a user by Username (email)
    static async findByUsername(username) {
        return await UserModel.findOne({ username });
    }

    // Static method to create a user with a guaranteed unique ID
    static async create(username, password, displayName, profilePic) {
        let id;
        // Generate a new UUID and check if it exists in the database
        // We must 'await' the database check inside the loop
        while (true) {
            id = crypto.randomUUID();
            const existing = await this.findByID(id);
            if (!existing) break;
        }

        const newUser = new UserModel({id, username, password, displayName, profilePic});
        return await newUser.save();
    }
}

module.exports = User;