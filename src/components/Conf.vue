<template>
  <div id="conf_box">
    <ul class="conf_list">
      <li><i class="fa fa-pencil-square-o fa-2x" aria-hidden="true"><span class="fa_title">Themes</span></i>
        <ul class="theme_list clearfix">
          <li class="theme_item" v-for="i in themes"><div class="theme_box" :style="{backgroundColor: i.color}" :class="{checked: themeId==i.id}" @click="checkTheme(i.id)"></div></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'conf',
  data: function(){
    return {
      themeId: 0
    }
  },
  props: ['themes'],
  methods: {
    checkTheme: function(id){
      this.themeId = id;
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
}
#conf_box {
  position: absolute;
  width: 300px;
  background-color: #283140;
  left: 510px;
  border-radius: 12px;
  line-height: 50px;
  padding-top: 10px;
}
#conf_box .fa{
  margin-left: 10px;
  margin-right: 10px;
}
#conf_box .fa_title{
  margin-left: 10px;
}
#conf_box:before {
  content: '';
  height: 0px;
  width: 0px;
  overflow: hidden;
  border: 12px solid transparent;
  border-right:  12px solid #283140;
  position: absolute;
  top: 16px;
  left: -21px;
}
#conf_box .conf_list {
  list-style: none;
  color: #eee;
  box-sizing: border-box;
  margin-left: 5px;
  margin-right: 5px;
}
#conf_box .conf_list>li{
  border-bottom: 1px solid #444;
}
.theme_list {
  width: 90%;
  margin: 0 auto;
}
.theme_item {
  float: left;
  width: 25%;
}
.theme_box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid green;
  margin: 0 auto;
}
.theme_box.checked {
  border: 4px solid #6f0;
}
</style>
