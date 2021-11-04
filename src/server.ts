import * as socket from 'socket.io';
import express from 'express';

const INDEX = '/index.html';
const PORT = process.env.PORT || 5000

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = socket(server)
let http = require("http").createServer(server);
let io = require("socket.io")(http);

io.on('connection', (socket:any) => {

    console.log(`[IO] server has a new connection`)

    socket.on('coordinate.changed', (data:any) => {
        console.log('🚀 - file: server.ts - line 20 - socket.on - data', data)
        io.emit(`coordinate.changed${data.id}`, data)
    })

    socket.on('new.marker.connected', (data:any) => {
        console.log('🚀 - file: server.js - line 25 - data', data)
        io.emit(`new.marker.connected`, data)
    })

    socket.on('isReady', (id:number) => { 
        console.log('🚀 - file: server.js - line 30 - data', id);
        io.emit(`isReady${id}`)
    })

    socket.on('ready', (entrega:any) => {
        console.log('🚀 - file: server.js - line 34 - data', entrega)
        io.emit(`ready${entrega.id}`, entrega)
    })

    socket.on('driver.disconect', (data:{driver:{id: number, name: string}}) => {
        io.emit('driver.disconect', data)
    })

    socket.on('disconnect', () => {
        console.log('[SOCKET] a server has disconnected')
    }) 

})

http.listen(PORT);