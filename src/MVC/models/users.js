// models/users.js

// array of users that simulates a database
const users = [];

class User {
    constructor(username, password, displayName, profilePic) {
        this.username = username; // this is the unique ID
        this.password = password;
        this.displayName = displayName;
        this.profilePic = profilePic;
    }

    static create(username, password, displayName, profilePic) {
        const newUser = new User(username, password, displayName, profilePic);
        users.push(newUser);
        return newUser;
    }

    static findByUsername(username) {
        return users.find(u => u.username === username);
    }
}

module.exports = User;