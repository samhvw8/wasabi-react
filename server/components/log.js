module.exports = (app, mydata, socketIO) => {

	socketIO
  .on('connection', function(socket) {

    socket.on('msg', function(msg) {
      logIO.emit('msg', msg);
    });

    socket.on('update', function(msg) {
      msg.timestamp = (new Date()).toISOString();
      console.log(msg);
      logIO.emit('update', msg);
    });
  });
}