<template>
  <div id="userlist">
    <div id="search">
      <input type="text" id="search_user" v-model="search"/>
    </div>
    <ul>
      <li class="userlist_item" :class="{active:active_user==0}" @click="change_current(0)">大厅<span class="notRead" v-show="notReadObj[0]>0">{{notReadObj[0] | notReadFilter}}</span></li>
      <li v-for="item in online_users" class="userlist_item" :class="{active: active_user==item.id}" v-show="userShow(item.name)" @click="change_current(item.id)">
        {{item.name}}
        <span class="notRead" v-show="notReadObj[item.id]>0">{{notReadObj[item.id] | notReadFilter}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  import Bus from '../bus.js'; //不使用vuex的时候 创建一个全局总线管理状态
  import { mapState } from 'vuex'
  import { mapActions } from 'vuex'

  export default {
    name: 'app',
    data: function(){
      return {
        userlist: {},
        search: '' 
      }
    },
    computed: {
      ...mapState([
          'online_users'
      ])
    },
    props : [
      'active_user','notReadObj'
    ],
    methods: {
      ...mapActions([
        'change_current'
      ]),
      userShow: function(name){
        return name.includes(this.search);
      }
    },
    filters: {
      notReadFilter: function(value){
        if(value>99){
          return '99+';
        }
        return value;
      }
    }
  }
</script>

<style scoped>
  #userlist {
    float: left;
    width: 170px;
    height: 500px;
    background-color: #283140;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    color: #fff;
  }
  #search {
    height: 45px;
    line-height: 45px;
    text-align: center;
  }
  #search_user {
    width: 80%;
    border: 0;
    outline: none;
    height: 24px;
    line-height: 24px;
    background: #fff;
    color: #eee;
    box-sizing: border-box;
    padding-left: 10px;
    background-color: #182130;
    border: 1px solid #333645;
  }
  #search_user {

  }
  .userlist_item {
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    padding-left: 10px;
    position: relative;
  }
  .userlist_item.active {
    background-color: #485160;
  }
  .userlist_item:hover:not(.active) {
    background-color: #384150;
  }
  .notRead {
    position: absolute;
    right: 15px;
    top: 17px;
    color: #fff;
    display: block;
    height: 16px;
    min-width: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 8px;
    font-size: 12px;
    color: #eee;
    background-color: #e50033;
    padding-left: 3px;
    padding-right: 3px;

  }
</style>
