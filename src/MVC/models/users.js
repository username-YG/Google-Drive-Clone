// models/users.js

// array of users that simulates a database
const users = [];

class User {
    constructor(ID, password, displayName, profilePic) {
        this.ID = ID; // this is the unique ID
        this.password = password;
        this.displayName = displayName;
        this.profilePic = profilePic;
    }

    static create(ID, password, displayName, profilePic) {
        const newUser = new User(ID, password, displayName, profilePic);
        users.push(newUser);
        return newUser;
    }

    static findByUsername(ID) {
        return users.find(u => u.ID === ID);
    }
}

module.exports = User;