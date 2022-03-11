const socket = require('socket.io')
const express = require('express')

const INDEX = '/index.html';
const PORT = process.env.PORT || 5000

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socket(server)

io.on('connection', socket => {

    console.log(`[IO] server has a new connection`)

    socket.on('coordinate.changed', data => {
        console.log("COORDENADA ALTERADA")
        console.log({data});
        io.emit(`coordinate.changed${data.user.idUser}`, data)
    })

    socket.on('new.marker.connected', data => {
        io.emit(`new.marker.connected`, data)
    })

    socket.on('isReady', (id) => {            
        io.emit(`isReady${id}`)
    })

    socket.on('ready', data => {
        io.emit(`ready${data.user.idUser}`, data)
    })

    socket.on('driver.disconect', data => {
        io.emit('driver.disconect', data)
    })

    socket.on('disconnect', () => {
        console.log('[SOCKET] a server has disconnected')
    }) 

})