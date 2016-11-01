<template>
	<div id="main">
		<div id="header">
			<div class="logo user_logo" :class="{syslogo: isSysLogo}">
				<div class="user_name">{{user.name}}</div>
			</div>
			<button class="fa fa-cog fa-2x" aria-hidden="true" @click="toggleConf"></button>
			<conf :themes="themes" v-show="conf"></conf>
		</div>
		<div id="content">
			<transition name="fade">
				<div class="alert alert-info tips" v-show="tipShow">{{tips}}</div>
			</transition>
			<p v-for="item in messages" class="message" :class="{self: item.self}">{{item.mess}}</p>
		</div>
		<div id="edit">
			<input type="text" class="mess" v-model.trim.lazy="mess" @keyup.enter="sendMess" />
			<button class="send" @click="sendMess">Send</button>
		</div>
	</div>
</template>

<script>
	import Conf from './Conf';
	import Bus from '../bus.js'; //不使用vuex的时候 创建一个全局总线管理状态

	export default {
		name: 'chat',
		components: {
		    Conf
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
	     	 	user: {name:'',logo:''}
	    	}
	  	},
	  	computed: {
  			isSysLogo: function(){
  				return this.user.logo.startsWith('sys');
  			}
	  	},
	  	methods: {
	  		sendMess: function(){
	  			if(this.mess){
	  				this.socket.emit('new_mess',this.mess);
					this.messages.push({
						mess: this.mess,
						self: true
					});
					this.mess = '';
					this.scrollBottom();
	  			}
	  		},
	  		getMess: function(data){
	  			this.messages.push({
					mess: data,
					self: false
				});
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
	  		}
	  	},
	  	created: function(){
	  		this.socket.on('message',this.getMess);
	  		this.socket.on('join',this.showTips);
	  	},
	  	//组件还没有装载，所以不能在data 中定义content
	  	mounted: function(){
	  		this.content = document.getElementById('content');
	  		Bus.$on('getUser',function(user){
	  			this.user = user;
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
	width: 500px;
	height: 400px;
	border-radius: 12px;
	background-color: #F1F1F1;
	position: relative;
}

#header {
	height: 60px;
	line-height: 60px;
	border-top-left-radius: 12px;
	border-top-right-radius: 12px;
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
	height: 270px;
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
@keyframes rotate{
	from{-webkit-transform:rotate(0deg)}
	to{-webkit-transform:rotate(360deg)}
}
</style>