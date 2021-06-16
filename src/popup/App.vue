<template>
  <div class="container">
     <b-row>
  <b-col lg="4" class="pb-2"><b-button size="lg" @click="launchScrapper">Launch Scrapper</b-button></b-col>
</b-row>
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
    launchScrapper(){

         chrome.tabs.create({ 'url': 'chrome-extension://' + chrome.runtime.id+"/options.html" });
      }
    }

}
</script>

<style lang="stylus">
</style>
