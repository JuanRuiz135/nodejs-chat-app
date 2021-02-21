const generateMessage: Function = (username: string, text: string) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage: Function = (username: string, url: string) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}


export { generateLocationMessage, generateMessage}