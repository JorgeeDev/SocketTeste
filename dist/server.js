"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const INDEX = '/index.html';
const PORT = process.env.PORT || 3333;
const server = (0, express_1.default)()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .get('/status', (req, res) => {
    express_1.response.status(200).send('Tudo certo');
});
let http = require("http").createServer(server);
let io = require("socket.io")(http);
io.on('connection', (socket) => {
    console.log(`[IO] server has a new connection`);
    socket.on('coordinate.changed', (data) => {
        console.log('🚀 - file: server.ts - line 20 - socket.on - data', data);
        io.emit(`coordinate.changed${data.id}`, data);
    });
    socket.on('new.marker.connected', (data) => {
        console.log('🚀 - file: server.js - line 25 - data', data);
        io.emit(`new.marker.connected`, data);
    });
    socket.on('isReady', (id) => {
        console.log('🚀 - file: server.js - line 30 - data', id);
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
console.log(`http:localhost:${PORT}`);
//# sourceMappingURL=server.js.map