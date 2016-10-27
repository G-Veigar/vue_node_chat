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
  * {
  margin: 0;
  padding: 0;
}

body {
  background-color: #DDE0E5;
}
</style>
