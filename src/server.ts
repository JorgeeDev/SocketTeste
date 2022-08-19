import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { getRedis, setRedis } from "./redisConfig";
const server = require('http').createServer();
const PORT = Number(process.env.PORT) || 80
const io = new Server(server, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});
instrument(io, {
    auth: {
        type: "basic",
        username: "root",
        password: "$2a$12$o.qM4FuApwFXNFfS5HA0O.9Tjcf4vYqWa2ZWxp.F28BWFQ5kebfom"
    }
});
interface Coordinate { lat: number, lng: number }
interface SocketDataType {
    room: string,
    idMotorista: string,
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
            console.log('create', data.room)
            client.join(data.room)
        } catch (error) {
            console.log('Quebrou no create')
        }
    })
    client.on('join', async (data: SocketDataType) => {
        try {
            console.log("JOIN", data.idMotorista)
            client.join(data.room)
        } catch (error) {
            console.log('Quebrou no join')
        }
    })
    client.on('req.coordinate.changed', async (data: SocketDataType) => {
        try {
            await setRedis(data.idMotorista, JSON.stringify(data))
            io.to(data.room).emit('res.coordinate.changed', data)
        } catch (error) {
            console.log('Quebrou no req.coordinate.changed')
        }
    })
    client.on("last.coordinates", async (data: SocketDataType) => {
        try {
            console.log("LAST COORDINATES: ", data)
            const lastCoordinates = await getRedis(data.idMotorista)
            const lastCoordinatesJson = await JSON.parse(lastCoordinates) as SocketDataType
            console.log("LAST JSON:", lastCoordinatesJson)
            io.to(data.room).emit("res.coordinate.changed", lastCoordinatesJson)
        } catch (error) {
            console.log("Quebrou no last.coordinates", error)
        }
    })
    client.on('disconnect', () => {
        console.log('[IO] a server has disconnected')
    })
})
io.listen(PORT);
console.log(`http://localhost:${PORT}`)