import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    logined: false,
    mess: '', //用户输入的消息
    socket: io('http://127.0.0.1:3000'),
    content: {},
    tips: "",
    tipShow: false,
    user: {name:'', logo:'', id:0},
    current_id: 0,
    messages: [],
    online_users: {}
  },
  getters: {
    current_mess: function(state){
      var res = state.messages.find(function(mess){
          return mess.id == state.current_id;
        });
        return res ? res:{};
    }
  },
  mutations: {
    setLogined: function(state, value){
      state.logined = value;
    },
    setMess: function(state, value){
      state.mess = value;
    },
    scrollBottom: function(state){
      state.content.scrollTop = state.content.scrollHeight;
    },
    initContent: function(state){
      state.content = document.getElementById('content');
    },
    setTips: function(state, value){
      state.tips = value;
    },
    setTipShow: function(state, value){
      state.tipShow = value;
    },
    setUser: function(state, value){
      state.user = value;
    },
    setCurrentId: function(state, value){
      state.current_id = value;
    },
    addNewMess: function(state, newMess){
      state.messages.push(newMess);
    },
    setOnlineUsers: function(state, value){
      state.online_users = value;
    },
    resetNotReady: function(state, id){
      var thisMess = state.messages.find(function(item){
        if(item.id == id){
          return true;
        }
        return false;
      });
      if(thisMess){
        thisMess.notRead = 0;
      }
    }
  },
  actions: {
    change_current: function({commit}, id){
      commit('setCurrentId', id);
      commit('resetNotReady', id); 
    },
  }
});

export default store;