<template>
  <div id="app"> 
    <login></login>
    <chat></chat>
  </div>
</template>

<script>
import Login from './components/Login'
import Chat from './components/Chat'

export default {
  name: 'app',
  components: {
    Login,Chat
  }
}
</script>

<style>
ul {
  list-style: none;
}
  * {
  margin: 0;
  padding: 0;
}
.clearfix {
  clear: both;
}

body {
  background: url('http://localhost:3000/img/bg.jpg') no-repeat;
  background-size: 100% 100%;
}
</style>
