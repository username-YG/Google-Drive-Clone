// models/users.js
const crypto = require('crypto');

const users = [];

class User {
    constructor(username, password, displayName, profilePic, ID) {
        this.username = username; // e.g., "tom@gmail.com"
        this.password = password;
        this.displayName = displayName;
        this.profilePic = profilePic;
        this.ID = ID; // The unique generated ID
    }

    // Static method to find a user by ID
    static findByID(ID) {
        return users.find(u => u.ID === ID);
    }

    // Static method to find a user by Username (email)
    static findByUsername(username) {
        return users.find(u => u.username === username);
    }

    // Static method to create a user with a guaranteed unique ID
    static create(username, password, displayName, profilePic) {
        let id;
        // Generate a new UUID and keep trying if it already exists
        while (this.findByID(id = crypto.randomUUID()));

        const newUser = new User(username, password, displayName, profilePic, id);
        users.push(newUser);
        return newUser;
    }
}

module.exports = User;