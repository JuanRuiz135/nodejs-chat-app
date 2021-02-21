interface User {
    id: string,
    username: string,
    room: string
}

const users: User[] = []

// crud operations

const addUser = ({id, username, room}: {id:string, username: string, room: string}) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user: User) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room };
    users.push(user);
    return { user }
}

const removeUser: Function = (id: string) => {
    const index = users.findIndex((user: User) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser: Function = (id: string) => {
    return users.find((user: User) => user.id === id)
}

const getUsersInRoom: Function = (room: string) => {
    return users.filter((user: User) => user.room === room)
}


export {
    User,
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}