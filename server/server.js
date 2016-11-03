var express  = require('express');
var bodyParser = require('body-parser');
var socket = require('socket.io');
var mysql = require('mysql');
var mysql_conf = require('../config/mysql_conf.js');
var bodyParser = require('body-parser');
var multer = require('multer'); 
var colors = require('colors');//终端着色插件
//bold italic underline inverse yellow cyan white magenta green red grey blue rainbow zebra random
var online_users = {};
var bind_users = {};

var db = mysql.createConnection(mysql_conf);
db.connect(function(err){
	if(err){
		console.error('error connecting: ' + err.stack);
		return ;
	}
	console.log(('db connected as id ' + db.threadId).green);
});

var query =  db.query('select * from user',function(err,res){
	if(err){
		console.error('error: '+ err);
		return ;
	}
	// for(var i in res){
	// 	console.log(res[i].name);
	// }
});
console.log('sql log: ' + query.sql + '  -date: ' + new Date());

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
var userLogoUpload = multer({ dest: '../static/img/user_logo/' });  //for parsing multipart/form-data

app.use(function(req, res, next){
	res.set('Access-Control-Allow-Origin','http://localhost:8080');
	//CORS 预检测请求
	if(req.method == 'OPTIONS'){
		res.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');
		res.set("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	}
	next();
});

app.post('/login',function(req, res, next){
	var name = req.body.name;
	var pass = req.body.pass;
	var query = db.query('select * from user where name=? and pass=?',[name,pass],function(error, result, fields){
		if(error){
			console.log('Mysql error when login: ' + error);
			return ;
		}
		//登录成功
		if(result.length==1){
			online_users[result[0].user_id] = {
				id: result[0].user_id,
				name: result[0].name,
				logo: result[0].logo
			};
			//广播在线用户列表
			io.sockets.emit('online_users',online_users);
			io.sockets.emit('join','一个新用户加入了聊天室');
			console.log(('一个新用户加入了聊天室:'+result[0].name).magenta);
			console.log('userlist: \n'.grey,online_users);
			res.json({
				code: 1,
				user: {
					id: result[0].user_id,
					name: result[0].name,
					logo: result[0].logo
				},
				msg: '登录成功'
			});
		}else{
			res.json({
				code: 0,
				msg: '用户名或密码错误'
			});
		}

	});
});

app.get('/get_themes',function(req,res,next){
	console.log('获取themes');
	var query = db.query('select * from themes',function(error, result, fields){
		if(error){
			console.log('Mysql error when get themes: ' + error);
			return ;
		}
		res.json({
			themes: result
		})
	});
});

app.post('/upload/logo',userLogoUpload.single('new_logo'), function(req, res, next){

});

app.use(express.static('node_modules',{

}));
//处理用户头像图片请求
app.use('/logo',express.static('./static/img/user_logo',{

}));
//处理常规图片请求
app.use('/img',express.static('./static/img',{

}));


var server = app.listen(3000,function(){
	console.log('chat app server run at 3000'.green);
});
var io = socket(server);


io.on('connection',function(socket){
	//发送在线用户列表
	socket.on('all_mess',function(data){
		console.log(('a all_mess: '+data.mess+" from " + data.id).cyan);
		data.name = online_users[data.id].name; 
		socket.broadcast.emit('all_mess',data);
	});
	//绑定用户到socket
	socket.on('bindUser',function(id){
		bind_users[id] = socket;
		console.log(('bind user '+ id).green);
	});
	//发送私人消息
	socket.on('private_mess',function(data){
		console.log(('a private_mess: '+data.mess+" from " + data.id + " to " + data.to).cyan);
		bind_users[data.to].emit('private_mess',data);
	});
});
