var express  = require('express');
var socket = require('socket.io');

var app = express();

app.use(express.static('node_modules',{
	setHeaders: function(res){
		res.set('Access-Control-Allow-Origin','*');
	}
}));

var server = app.listen(3000,function(){
	console.log('chat app server run at 3000');
});
var io = socket(server);


io.on('connection',function(socket){
	socket.on('new_mess',function(data){
		console.log('a new mess: '+data);
		socket.broadcast.emit('message',data);
	});
	socket.broadcast.emit('join','一个新用户加入了聊天室');
	console.log('一个新用户加入了聊天室');
});
