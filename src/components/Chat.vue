<template>
	<div id="main" class="clearfix">
		<userlist :active_user="current_id" :notReadObj="notReadObj" @change_session="change_current"></userlist>
		<div id="main_right">
			<div id="header">
				<div class="logo user_logo" :class="{syslogo: isSysLogo}">
					<div class="user_name">{{user.name}}</div>
				</div>
				<button class="fa fa-cog fa-2x" aria-hidden="true" @click="toggleConf"></button>
				<!-- conf组件 -->
				<!-- <conf :themes="themes" v-show="conf"></conf> -->
			</div>
			<div id="content">
				<transition name="fade">
					<div class="alert alert-info tips" v-show="tipShow">{{tips}}</div>
				</transition>
				<div v-for="item in current_mess.mess" class="mess_box">
					<div class="mess_user" v-if="!item.self">{{item.name}}</div>
					<p  class="message" :class="{self: item.self}">{{item.value}}</p>
				</div>
			</div>
			<div id="edit">
				<input type="text" class="mess" v-model.trim.lazy="mess" @keyup.enter="sendMess" />
				<button class="send" @click="sendMess">Send</button>
			</div>
		</div>
	</div>
</template>

<script>
	import Conf from './Conf';
	import Userlist from './Userlist';
	import Bus from '../bus.js'; //不使用vuex的时候 创建一个全局总线管理状态

	export default {
		name: 'chat',
		components: {
		    Conf,Userlist
		},
		data () {
	    	return {
	     	 	msg: 'Welcome to Your Vue.js App',
	     	 	mess: "",
	     	 	messages: [],
	     	 	socket: io('http://127.0.0.1:3000'),
	     	 	content: document.getElementById('content'),
	     	 	tips: "",
	     	 	tipShow: false,
	     	 	timeoutId: '',
	     	 	conf: false,
	     	 	confTitle: 'Setting',
	     	 	themes: [],
	     	 	user: {name:'', logo:'', id:0},
	     	 	current_id: 0
	    	}
	  	},
	  	computed: {
  			isSysLogo: function(){
  				return this.user.logo.startsWith('sys');
  			},
  			current_mess: function(){
  				var res = this.messages.find(function(mess){
					return mess.id == this.current_id;
				}.bind(this));
				return res ? res:{};
  			},
  			notReadObj: function(){
  				var obj ={};
  				this.messages.map(function(item){
  					obj[item.id] = item.notRead;
  				})
  				return obj;
  			}
	  	},
	  	methods: {
	  		sendMess: function(){
	  			if(this.mess){
	  				//聊天大厅的广播消息
	  				if(this.current_id==0){
	  					this.socket.emit('all_mess',{
		  					mess: this.mess,
		  					id: this.user.id
		  				});
	  				}else{  //发送私人消息
	  					this.socket.emit('private_mess',{
		  					mess: this.mess,
		  					id: this.user.id,
		  					to: this.current_id
		  				});
	  				}
	  				if(this.current_mess.mess){
						this.current_mess.mess.push({
							value: this.mess,
							self: true
						});
					}else {
						this.messages.push({
							id: this.current_id,
							mess: [{
								value:this.mess,
								self: true
							}]
						});
					}
					this.mess = '';
					this.scrollBottom();
	  			}
	  		},
	  		getMess: function(data,isAll){
	  			//如果是广播消息
	  			var id = isAll? 0 : data.id;
  				var messObj = this.messages.find(function(mess){
	  				return mess.id == id;
	  			});
	  			var notRead;
	  			if(messObj){
	  				//如果消息不是当前聊天框消息
		  			if(id!=this.current_id){
		  				//未读信息+1
		  				messObj.notRead += 1;
		  			}
	  				messObj.mess.push({
						value: data.mess,
						name: data.name,
						self: false
					});
	  			}else{
	  				notRead = (id!=this.current_id)? 1 : 0 ;
	  				this.messages.push({
	  					id: id,
	  					notRead: notRead,
	  					mess: [{
	  						value: data.mess,
	  						name: data.name,
							self: false
	  					}]
	  				});
	  			}
				this.scrollBottom();
	  		},
	  		scrollBottom: function(){
	  			this.content.scrollTop = this.content.scrollHeight;
	  		},
	  		showTips: function(data){
	  			this.tips = data;
	  			this.tipShow = true;
	  			this.timeoutId?clearTimeout(this.timeoutId):null;
	  			this.timeoutId = setTimeout(this.hideTips,3000);
	  		},
	  		hideTips: function(){
	  			this.tipShow = false;
	  		},
	  		toggleConf:function(){
	  			if(this.conf){
			       this.conf = false;
			    }else{
			       this.$http.get('http://localhost:3000/get_themes').then((res)=>{
			       		this.themes = [];
			       		this.themes = this.themes.concat(res.data.themes);
			       },(res)=>{

			       })
			       this.conf = true;
			    }
	  		},
	  		getOnlineUser: function(data){
	  			Bus.$emit('getUserList',data);
	  		},
	  		change_current: function(id){
	  			this.current_id = id;
	  			this.current_mess.notRead = 0; 
	  		}
	  	},
	  	created: function(){
	  		this.socket.on('all_mess',function(data){
	  			this.getMess(data,true);
	  		}.bind(this));
	  		this.socket.on('private_mess',function(data){
	  			this.getMess(data,false);
	  		}.bind(this));
	  		this.socket.on('join',this.showTips);
	  		this.socket.on('online_users',this.getOnlineUser);
	  	},
	  	//组件还没有装载，所以不能在data 中定义content
	  	mounted: function(){
	  		this.content = document.getElementById('content');
	  		Bus.$on('getUser',function(user){
	  			this.user = user;
	  			this.socket.emit('bindUser',user.id);
	  		}.bind(this));
	  	},
	  	//等组件将messages更新完之后才能执行 滚动到底部
	  	updated: function(){
	  		this.scrollBottom();
	  	}
	}
</script>

<style scoped>
#main {
	margin: 0 auto;
	margin-top: 80px;
	width: 670px;
	height: 500px;
	border-radius: 6px;
	background-color: #F1F1F1;
	position: relative;
}
#main_right {
	float: left;
	width: 500px;
}

#header {
	height: 60px;
	line-height: 60px;
	border-top-right-radius: 6px;
	background-color: #827FCD;
}

#header .fa{
	color: #fff;
	float: right;
	margin-top: 12px;
	margin-right: 15px;
	background: none;
	border: none;
	outline: none;
	cursor: pointer;
}

#content {
	background-color: #fff;
	height: 370px;
	box-sizing: border-box;
	padding-top: 10px;
	overflow-y: scroll; 
}

#edit {
	margin-left: 15px;
	margin-right: 15px;
	margin-top: 12px;
	height: 46px;
	line-height: 46px;
	background-color: #fff;
	border-radius: 12px;
	height: auto;
}

#edit .mess{
	border: 0;
	height: 40px;
	outline: none;
	font-size: 18px;
	color: #aaa;
	margin-left: 20px;
	width: 360px;
}

#edit .send{
	border: 0;
	border-left: 1px solid #e1e1e1;
	outline: none;
	background-color: #fff;
	color: #827FCD;
	font-size: 18px;
	padding-left: 15px;
	cursor: pointer;
	height: 30px;
	line-height: 30px;
}

.message {
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	background-color: #827FCD;
	color: #fff;
	padding-left: 12px;
	padding-right: 12px;
	border-radius: 8px;
	margin-left: 20px;
	margin-bottom: 15px;
	float: left;
	clear: both;
	position: relative;
	margin-left: 60px;
}
.message:not(.self):before {
	content: '';
	height: 0px;
	border: 8px solid transparent;
	border-right:  14px solid #827FCD;
	position: absolute;
	top: 22px;
	left: -16px;
}

.message.self {
	float: right;
	background-color: #F1F1F1;
	color: #6F6F6F;
	margin-right: 20px;
}

.message.self:after {
	content: '';
	height: 0px;
	width: 0;
	border: 8px solid transparent;
	border-left:  14px solid #F1F1F1;
	position: absolute;
	top: 22px;
	right: -16px;
}
.tips {
	text-align: center;
	height: 24px;
	line-height: 24px;
	padding: 0;
	padding-left: 10px;
	padding-right: 10px;
	position: absolute;
	left: 50%;
	transform:translate(-50%);
	z-index: 1;
	font-size: 12px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}
.fa-cog{
	animation:   7s linear infinite rotate;
	animation-play-state:paused;
}
.fa-cog:hover {
	animation-play-state:running;
}
.user_logo {
	position: absolute;
	width: 46px;
	height: 46px;
	border-radius: 50%;
	margin-top: 7px;
	margin-left: 15px;
}
.syslogo {
	background-image: url('http://localhost:3000/logo/sys.jpg');
	background-size: 400%;
}
.user_name {
	position: absolute;
	height: 46px;
	line-height: 46px;
	left: 55px;
	color: #fff;
}
.mess_user {
	position: absolute;
	left: 8px;
	top: 3px;
	width: 35px;
	height: 35px;
	border-radius: 50%;
	background-color: blue;
}
.mess_box {
	position: relative;
	clear: both;
}
@keyframes rotate{
	from{-webkit-transform:rotate(0deg)}
	to{-webkit-transform:rotate(360deg)}
}
</style>