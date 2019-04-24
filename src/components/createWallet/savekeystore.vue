<template>
  <div>
    <div class="newwallet_box">
      <div class="contTip_box">
        <hgroup class="contTip_title flex-c">
          <h3 class="title" v-html="LANG.TITLE.SAVE_LEYSTORE_FILE">

          </h3>
        </hgroup>
        <div class="contTip_btn flex-c">
          <!-- <button class="btn flex-c" download="Download the Vue Devtools extension for a better development experience:">Download Keystore File (UTC / JSON)</button> -->
          <a
            class="btn flex-c"
            :download="keystoreName"
            :href="keystoreURL"
            @click="downloadChange"
          >{{LANG.BTN.DOWNLOAD_KEYSTORE}}</a>
        </div>
      </div>

      <div class="contTip_box">
        <hgroup class="contTip_title noborder">
          <p class="p" v-html="LANG.SAVE_KEYSTORE_TIP.SAVE_KEYSTORE_TIP_0">
          </p>
        </hgroup>
        <div class="contTip_btn flex-c">
          <button class="btn flex-c red" @click="goBackupWallet" id="understandBtn" disabled="disabled">{{LANG.BTN.UNDERSTAND_CONTINUE}}</button>
        </div>
      </div>
      <div class="contTip_p">
        <p v-html="LANG.SAVE_KEYSTORE_TIP.SAVE_KEYSTORE_TIP_1">
        </p>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: "createWallet",
  data () {
    return {
      password: "",
      keystoreURL: "",
      keystoreName: ""
    }
  },
  mounted () {
    this.keystoreURL = this.$store.state.wallet.keystoreURL
    this.keystoreName = this.$store.state.wallet.downloadName
    if (!this.keystoreURL) {
      history.go(-1)
    }
    this.$store.commit("storeAddress", "")
  },
  methods: {
    goBackupWallet () {
      this.$router.push("/")
    },
    downloadChange () {
      document.getElementById("understandBtn").removeAttribute("disabled")
    }
  }
}
</script>
