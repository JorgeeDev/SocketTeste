"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const INDEX = '/index.html';
const PORT = process.env.PORT || 5000;
const server = express_1.default()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }));
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));
// const io = socket(server)
let http = require("http").createServer(server);
let io = require("socket.io")(http);
io.on('connection', (socket) => {
    console.log(`[IO] server has a new connection`);
    socket.on('coordinate.changed', (data) => {
        // console.log('🚀 - file: server.ts - line 20 - socket.on - data', data)
        io.emit(`coordinate.changed${data.id}`, data);
    });
    socket.on('new.marker.connected', (data) => {
        console.log('🚀 - file: server.js - line 25 - data', data);
        io.emit(`new.marker.connected`, data);
    });
    socket.on('isReady', (id) => {
        console.log('🚀 - file: server.js - line 30 - data', id);
        console.log(`isReady${id}`);
        io.emit(`isReady${id}`);
    });
    socket.on('ready', (entrega) => {
        console.log('🚀 - file: server.js - line 34 - data', entrega);
        io.emit(`ready${entrega.id}`, entrega);
    });
    socket.on('driver.disconect', (data) => {
        io.emit('driver.disconect', data);
    });
    socket.on('disconnect', () => {
        console.log('[SOCKET] a server has disconnected');
    });
});
http.listen(PORT);
//# sourceMappingURL=server.js.map