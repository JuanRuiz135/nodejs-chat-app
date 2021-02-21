import * as path from 'path';
import * as http from 'http';
import * as express from 'express';
import { Socket, Server } from 'socket.io';
import { generateMessage, generateLocationMessage } from './utils/messages';
import { addUser, removeUser, getUser, getUsersInRoom, User } from './utils/users';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

interface Coords {
    latitude: number,
    longitude: number
}

io.on('connection', (socket: Socket) => {
    console.log('New websocket connection!');

    socket.on('join', ({username, room}: {username: string, room: string}, callback: Function) => {
        const query = addUser({ id: socket.id, username, room});

        if (query.error) {
            return callback(query.error);
        }
        var user = query.user;

        console.log(user.room);
        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined! Say hi!`));
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();

    })

    socket.on('sendMessage', (message: string, callback: Function) => {
        const user: User = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();

    })

    socket.on('sendLocation', (coords: Coords, callback: Function) => {
        console.log(coords);
        const user: User = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on('disconnect', () => {
        const user: User = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left the room.`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})