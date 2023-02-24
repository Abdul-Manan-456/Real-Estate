const { addUser, removeUser, getUser } = require('./users');
const messageFormat = require('./messages');

exports.handleSocket = (io) => {

    io.on('connection', (socket) => {

        //Rooms Chat 
        socket.on('join', ({ username, room }, callback) => {

            const botName = 'Admin'

            //add user
            const { error, user } = addUser({ id: socket.id, username, room });

            if (error) {
                return callback(error);
            }
            socket.join(user.room);

            // Welcome to all new users
            socket.emit('message', messageFormat(botName, 'Welcome to the Real Estate'))

            //Broadcast when  a new use connects
            socket.broadcast.to(user.room).emit('message', messageFormat(`${user.username}`, `${user.username} has join the chat`))

            //message from client
            socket.on('sendMessage', (msg) => {
                console.log(msg)
                io.to(user.room).emit('message', messageFormat(`${user.username}`, msg))
            })

            //DISCONNECTED
            socket.on('disconnect', () => {

                const user = removeUser(socket.id);
                if (user) {
                    io.to(user.room).emit('message', messageFormat(botName, `${user.username} has disconnected`))
                }

            })
        })

    })
}