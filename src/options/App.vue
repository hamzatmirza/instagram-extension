<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <b-row class="my-1">
    <b-col sm="10">
      <label >SET THE TIME FOR INSTAGRAM REQUEST IN SECONDS</label>
    </b-col>
    <b-col sm="2">
 <b-form-input
          v-model="timeDelay"
          placeholder="Enter Time Delay between requests in Seconds"
        />    </b-col>
  </b-row>


      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <b-button
          variant="success"
          @click="getPendingsList"
          :disabled="pendingListLoading"
        >
          Get Pendings List
        </b-button>
      </div>
      <div class="col-6">
        <b-button
          variant="success"
          @click="getUpdateList"
          :disabled="pendingListLoading"
        >
          Get To Update List
        </b-button>
      </div>
    </div>
    <div
      v-if="pendingList"
      class="row pendingList"
    >
      <div class="row">
        <div class="col-12">
          <b-table

            v-if="pendingList"
            :per-page="pendingListperPage"
            :current-page="pendingListCurrentPage"
            striped
            hover
            :items="pendingList"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-2">
          <b-pagination

            v-model="pendingListCurrentPage"
            :total-rows="pendingList.length"
            :per-page="pendingListperPage"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <p>
            Total Records: {{ pendingList.length }}
          </p>
        </div>
        <div class="col-3">
          <b-button
            variant="success"
            :disabled="scrapperRunning"
            @click="pendingScrapper"
          >
            Start
          </b-button>
        </div>
        <div class="col-3">
          <b-button
            variant="success"
            :disabled="!scrapperRunning"
            @click="stopScrapper"
          >
            Stop
          </b-button>
        </div>
      </div>
    </div>
    <div
      v-if="instaScrapped.length>0"
    >
      <div class="row">
        <div class="col">
          <b-table
            :per-page="scrappedDataPerPage"
            :current-page="scrappedDataCurrentPage"

            striped
            hover
            :items="instaScrapped"
            :fields="scrapperTableFields"
             :busy.sync="isUploadingToWebsite"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-2">
          <b-pagination

            v-model="scrappedDataCurrentPage"
            :total-rows="instaScrapped.length"
            :per-page="scrappedDataPerPage"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <p>
            Total Scrapped Records: {{ instaScrapped.length }}
          </p>
           <p>
            Total Failed Records: {{ failedUsernames.length }}
          </p>
        </div>
        <div class="col-6">
          <b-button
            variant="success"
            :disabled="isUploadingToWebsite"
            @click="uploadToWebsite"
          >
            UPLOAD TO WEBSITE
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      msg: 'Welcome!',
      pendingList:null,
      pendingListLoading:false,
      pendingListFields:[],
      pendingListCurrentPage:1,
      pendingListperPage:50,
      scrapperStarted:false,
      instaScrapped:[],
      scrapperRunning:false,
      scrapperTableFields:["biography","username","followedBy","follow"],
      timeDelay:1,
      scrappedDataCurrentPage:1,
      scrappedDataPerPage:50,
      isUploadingToWebsite:false,
      failedUsernames:[],
      updateList:null,
      endPoint:""
    }
  },
  methods:{
    uploadToWebsite(){
    const _this = this;
    this.isUploadingToWebsite = true;
    if(this.updateList = true){
        this.endPoint = "https://igprfl.com/wp-json/instascrapper/v1/updateList";
    }else{
      this.endPoint = "https://igprfl.com/wp-json/instascrapper/v1/create";
    }


       axios.post(this.endPoint,{"scrappedData":this.instaScrapped}).then(function(response){
        console.log(response.data);
        _this.instaScrapped = [];
        _this.isUploadingToWebsite = false;
     });
    },
    stopScrapper(){
        this.scrapperRunning=false;
      },
    async startPendingScrappingProcess(username,index,post_id){


    const _this = this;
    console.log(`AJAX STARTED for ${ username}`);
      await axios.get(`https://www.instagram.com/${username}/?__a=1`).then(async function(response){
        console.log("AJAX DONE");
        const insta = {
          biography:response.data.graphql.user.biography,
          username:response.data.graphql.user.username,
          followedBy:response.data.graphql.user.edge_followed_by.count,
          follow:response.data.graphql.user.edge_follow.count,
          profilePic:response.data.graphql.user.profile_pic_url_hd,
          fullName:response.data.graphql.user.full_name,
          postId:post_id
          };

        _this.instaScrapped.push(insta);
        _this.pendingList.splice(index,1);



     }).catch((e)=>{
       _this.failedUsernames.push(_this.pendingList[index]);
           _this.pendingList.splice(index,1);
           console.log(e.response);

     });



    },
    async pendingScrapper(){

      this.scrapperRunning=true;
      for(let i = 0;i<this.pendingList.length;i++){


        if(this.scrapperRunning==false){console.log("SCRAPPER STOPPED");break;}
        console.log("LOOP ITERATION");
        console.log("PREVIOUS SCARAPPED DATA",this.instaScrapped);
        await this.startPendingScrappingProcess(this.pendingList[i].instagram_id,i,this.pendingList[i].post_id);
        console.log("LOOP NEXT ITERATION");
        console.log(`RUNNING THE CODE AFTER ${this.timeDelay} sec`);
        await this.sleep(this.timeDelay);


      }
      this.scrapperRunning=false;



    },
    getPendingsList(){
      this.instaScrapped = [];
      this.updateList = false;
      this.pendingListLoading = true;
      // https://www.instagram.com/hamza.t.mirza/?__a=1
      const _this = this;
       axios.get("https://igprfl.com/wp-json/instascrapper/v1/pendings").then(function(response){
        _this.pendingList = response.data;
        _this.pendingListLoading = false;
     });
    },
    getUpdateList(){
      this.instaScrapped = [];
      this.updateList=true;
 this.pendingListLoading = true;
      // https://www.instagram.com/hamza.t.mirza/?__a=1
      const _this = this;
       axios.get("https://igprfl.com/wp-json/instascrapper/v1/updateList").then(function(response){
        _this.pendingList = response.data;
        _this.pendingListLoading = false;
     });
    },
    async testAPI(){



          console.log("FUNCTION STARTED NOW WAITING");
            await this.sleep(5000);
          console.log("CALLING AJAX NOW");



    },
    sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms*1000);
  });
}
  }
}
</script>

<style lang="stylus">
</style>
