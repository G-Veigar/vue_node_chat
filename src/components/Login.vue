<template>
	<div id="login_box" v-if="!logined">
		<div id="left">
			<div class="round"></div>
		</div>
		<div id="right">
			<div class="round" id="login_round">
				<div id="form_box">
					<input type="text" name="username" v-model="username" /><i class="fa fa-user fa-lg" aria-hidden="true"></i>
					<input type="password" name="password" v-model="password" @keyup.enter="login" /><i class="fa fa-lock fa-lg" aria-hidden="true"></i>
					<button id="login_btn" @click="login">Login</button>
					<button id="reg_btn">注册新用户</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Bus from '../bus.js'; //不使用vuex的时候 创建一个全局总线管理状态
	export default {
		name: 'login',
		data: function(){
			return {
				username: '',
				password: '',
				logined: false
			}
		},
		methods: {
			login: function(){
				this.$http.post('http://localhost:3000/login',{
					name: this.username,
					pass: this.password
				}).then((res)=>{
					if(res.data.code==1){
						this.logined = true;
						//使用全局总线管理状态变更
						Bus.$emit('getUser',res.data.user);
					}else if(res.data.code==0){
						alert(res.data.msg);
					}
				},(res)=>{
					alert('some error');
				});
			}
		}
	}
</script>

<style scoped>
#login_box {
	position: fixed;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	background-color: rgba(23,211,32,0.3);
	z-index: 1000;
}

#left {
	width: 50%;
	float: left;
	background-color: #1BBC9B;
	bottom: 0;
	top: 0;
	left: 0;
	position: absolute;
	box-sizing: border-box;
	border-right: 1px solid #aaa;
}

#right {
	width: 50%;
	float: right;
	background-color: #1BBC9B;
	bottom: 0;
	top: 0;
	right: 0;
	position: absolute;
	box-sizing: border-box;
	border-left: 1px solid #aaa;
}
.round {
	width: 400px;
	height: 400px;
	border-radius: 50%;
	box-sizing: border-box;
	border: 1px solid #666;
	position: absolute;
	top: 50%;
	margin-top: -200px;
}

#left .round {
	right: -200px;
	border-right: 0;
}

#right .round {
	left: -200px;
	border-left: 0;
	background-color: #eee;
}

#form_box {
	width: 280px;
	height: 280px;
	box-sizing: border-box;
	position: absolute;
	left: 50%;
	top: 50%;
	margin-top: -140px;
	margin-left: -140px;
	padding-top: 45px;
}
#form_box label{
	position: relative;
}
#form_box .fa{
	color: #ccc;
	position: absolute;
	right: 14px;
}
#form_box .fa-user {
	top: 60px;
}
#form_box .fa-lock {
	top: 122px;
}

#right input {
	display: block;
	width: 100%;
	height: 45px;
	margin-bottom: 18px;
	border-radius: 6px;
	border: 0;
	outline: none;
	box-sizing:border-box;
	padding-left: 10px;
	font-size: 18px;
	color: #999;
}

#login_btn {
	display: block;
	width: 100%;
	height: 45px;
	margin-bottom: 18px;
	margin-top: 30px;
	border-radius: 6px;
	border: 0;
	outline: none;
	box-sizing:border-box;
	padding-left: 5px;
	font-size: 18px;
	color: #fff;
	background-color: #1BBC9B;
	cursor: pointer;
} 

#reg_btn {
	display: block;
	border: 0;
	outline: none;
	background-color: transparent;
	color: #666;
	cursor: pointer;
	margin: 0 auto;
}

#reg_btn:hover {
	color: #1BBC9B;
}
</style>