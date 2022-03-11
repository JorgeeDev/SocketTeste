import { Server } from "socket.io";


const server = require('http').createServer();
const PORT = Number(process.env.PORT) || 3333
const io = new Server(server);

interface Coordinate { lat: number, lng: number }

interface SocketDataType {
    room: string,
    marker: {
        id: string,
        name: string,
        coordinates: { lat: number, lng: number },
    },
    destination: Coordinate
    message: string,
}


io.on('connection', async client => {

    console.log(`[IO] server has a new connection`)

    client.on('create', (data: SocketDataType) => {

        try {
            console.log('create')
            client.join(data.room)
        } catch (error) {
            console.log('Quebrou no create')
        }

    })

    client.on('join', (data: SocketDataType) => {

        try {
            console.log('join')
            client.join(data.room)
        } catch (error) {
            console.log('Quebrou no join')
        }

    })

    client.on('req.coordinate.changed', (data: SocketDataType) => {

        try {
            console.log('coordinate.changed')
            io.to(data.room).emit('res.coordinate.changed', data)
        } catch (error) {
            console.log('Quebrou no req.coordinate.changed')
        }

    })

    client.on('disconnect', () => {
        console.log('[IO] a server has disconnected')
    })

})

io.listen(PORT);
console.log(`http:localhost:${PORT}`)