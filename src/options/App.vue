<template>
  <div class="container">
      <b-button @click="testAPI" variant="success">Button</b-button>

  </div>
</template>

<script>


export default {
  data() {
    return {
      msg: 'Welcome!'
    }
  },
  methods:{
    testAPI(){
     axios.get("https://www.instagram.com/hamza.t.mirza/?__a=1").then(function(response){
        console.log(response);
     });
    }
  }
}
</script>

<style lang="stylus">
</style>
