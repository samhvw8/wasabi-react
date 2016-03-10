module.exports = (app, mydata, socketIO) => {

	socketIO
  .on('connection', function(socket) {
    socket.on('msg', function(msg) {
      chat.emit('msg', msg);
    });
  });
}