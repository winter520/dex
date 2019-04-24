<template>
  <div>
    <div class="newwallet_box">

      <div class="newWallet_title flex-c">
        <h3 class="title">{{LANG.TITLE.CREATE_NEW_WALLET}}</h3>
      </div>

      <div class="createInfo_box">
        <div class="createInfo_input">
          <input
            type="password"
            :placeholder="LANG.PLACEHOLDER.ENTER_PASSWORD"
            class="input-text input"
            v-model="password"
            id="createInfoInput"
            @keyup="validPwd"
          >
        </div>
        <div class="createInfo_danger">{{LANG.WARNING_TIP.TIP_0}}</div>
        <div class="createInfo_btn flex-c">
          <button class="btn" @click="changePwd">{{LANG.BTN.NEXT_STEP}}</button>
        </div>
        <hgroup class="createInfo_tip">
          <h1
            class="h1"
          >{{LANG.CREATE_TIP.CREATE_TIP_0}}</h1>
          <h2 class="h2">{{LANG.CREATE_TIP.CREATE_TIP_1}}</h2>
          <h3
            class="h3"
          >{{LANG.CREATE_TIP.CREATE_TIP_2}}
            <br/>{{LANG.CREATE_TIP.CREATE_TIP_3}}
          </h3>
        </hgroup>
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
      walletInit: ""
    }
  },
  mounted () {
    this.$store.commit("storeWalletLoadFlag", true)
    this.$store.commit("storeAddress", "")
  },
  methods: {
    goSaveKeystore () {
      this.$router.push("/saveKeystore")
    },
    createKey (pwd) {
      this.walletInit = wallet.generate(pwd)
    },
    changePwd () {
      if (this.password.length < 9) {
        this.$$.errTip(this.LANG.ERROR_TIP.TIP_0)
      } else {
        this.createKey()
        let walletJSON = this.walletInit.toV3(this.password, {
          kdf: "scrypt",
          n: 8192
        })
        let keyStoreURL = this.$$.getBlob("text/json;charset=UTF-8", walletJSON)
        this.$store.commit("storeKeystoreURL", keyStoreURL)
        this.$store.commit("storeDownload", this.walletInit.getV3Filename())
        this.goSaveKeystore()
      }
    },
    validPwd (e) {
      if (this.password.length < 9) {
        document.getElementById("createInfoInput").style.border = "2px solid #ea4b40"
      } else {
        document.getElementById("createInfoInput").style.border = "2px solid #2f7cd7"
        if (e.which === 13) {
          this.changePwd()
        }
      }
    }
  }
}
</script>
