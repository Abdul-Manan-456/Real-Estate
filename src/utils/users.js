const users = [];


// ADD USERS
exports.addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if (!username || !room) {
        return {
            error: 'username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find(user => {
        return (user.username === username && user.room === room)
    })

    // throw error if user already in use
    if (existingUser) {
        return {
            error: 'user already in use'
        }
    }

    //sotre the user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

//remove the user
exports.removeUser = (id) => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

exports.getUser = (id) => {
    return users.find(user => user.id === id)
}

// exports.getUsersInRoom = (room) => {
//     room = room.trim().toLowerCase();
//     return users.filter(user => user.room === room)
// }