<template>
  <div id="test">
    <h1>{{count}}</h1>
    <button @click="add">add</button>
    <button @click="increment(2)">add2</button>
    <button @click="reset">reset</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'


export default {
  name: 'test',
  computed: {
    ...mapState([
      'count','name','age'
    ]),
    ...mapGetters([
      'fullname'
    ])
  },
  methods: {
    add: function(){
      this.$store.commit('increment',2);
    },
    ...mapMutations([
      'increment'
    ]),
    ...mapActions([
      'reset'
    ])
  }
}
</script>

<style>
#test {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #eee;
}
</style>
