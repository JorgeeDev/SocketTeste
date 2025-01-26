import { instrument } from "@socket.io/admin-ui";
import { Server } from "socket.io";
const server = require('http').createServer((req:any, res:any) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Node.js!');
  }
  );
const PORT = Number(process.env.PORT) || 3004
const HOST = "0.0.0";
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
    console.log(`[IO] Nova conexão: ${client.id}`);

    client.on("isReady", (data: { room: string }) => {
      try {
        console.log(`[IO] Cliente pronto para a sala: ${data.room}`);
        client.join(data.room); // Adiciona o cliente à sala especificada
        io.to(data.room).emit("res.coordinate.changed", {
          message: `Bem-vindo à sala ${data.room}`,
        });
      } catch (error) {
        console.error("[IO] Erro no evento isReady:", error);
      }
    });
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
            io.to(data.room).emit('res.coordinate.changed', data)
        } catch (error) {
            console.log('Quebrou no req.coordinate.changed')
        }
    })
    client.on("last.coordinates", async (data: SocketDataType) => {
        try {
            console.log("LAST COORDINATES: ", data)
            io.to(data.room).emit("res.coordinate.changed", "era o banco redis")
        } catch (error) {
            console.log("Quebrou no last.coordinates", error)
        }
    })

})
server.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});