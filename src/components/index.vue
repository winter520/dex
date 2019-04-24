<template>
  <div class="boxContent" id="app">
    <header class="headerTop_box flex-bc">
      <div class="logo flex-c">
        <router-link to="/" class="logoImg flex-c">
          <img src="@etc/img/logo.svg" class="logoImgVisibleLg">
          <img src="@etc/img/logoxs.svg" class="logoImgVisibleXs">
        </router-link>
      </div>
      <div id="topSearchView" v-if="isSelectOrSet">
        <div class="flex-ec">
          <div class="headerTop_langBox">
            <el-select v-model="language" size="mini" @change="changLanguage">
              <el-option
                v-for="item in languageOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="headerTop_serBox">
            <img src="@etc/img/wifi.png" class="wifi">
            <i class="arrow"></i>
            <el-select v-model="network" @change="changNetwork" class="select">
              <el-option
                v-for="item in networkOPtion"
                :key="item.url"
                :label="item.name"
                :value="item.url"
                no-data-text="Custom"
              >
              </el-option>
              <el-option value="https://" label="Custom" ></el-option>
              <el-option value="offLine" label="off-line" ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="headerTop_setBox" id="topSetView" v-if="!isSelectOrSet">
        <ul class="flex-ec">
          <li id="copyAddress" @click="copyAddress('addressCopy','copyAddress')" class="cursorP">
            <a class="setBtn flex-c">
              <el-popover
                trigger="hover"
                :content="LANG.BTN.COPY_CLIPBOARD">
                <div class="addreess" slot="reference">{{walletAdressTop}}</div>
                <!-- <el-button slot="reference">hover 激活</el-button> -->
              </el-popover>
              <img src="@etc/img/copy2.svg">
            </a>
          </li>
          <!-- <li><router-link class="setBtn flex-c" to="/backupSure"><img src="@etc/img/Setting2.svg"></router-link></li> -->
          <li><a class="setBtn flex-c cursorP" @click="tobackupWallet"><img src="@etc/img/Setting2.svg"></a></li>
          <li><router-link class="setBtn flex-c" to="/"><img src="@etc/img/Help.svg"></router-link></li>
          <li><div class="setBtn flex-c cursorP" @click="refreshPage"><img src="@etc/img/Refresh.svg"></div></li>
          <li><router-link class="setBtn flex-c" to="/"><img src="@etc/img/Quit.svg"></router-link></li>
        </ul>
      </div>
    </header>
    <input type="text" v-model="walletAdress" id="addressCopy" class="fixedHide">
    
    <section id="boxContent_box">
      <transition name="fade">
        <!-- <router-view @setAddress='getChildInfo' v-if="isRouterAlive" ref="nav"></router-view> -->
        <router-view v-if="isRouterAlive" ref="nav"></router-view>
      </transition>
    </section>
    <footer class="footerBottom_box flex-c">
      <ul class="flex-c">
        <li><a href="https://fusion.org" target="_blank"><img src="@etc/img/logo-white.svg" width="61" height="16"></a></li>
        <li class="center flex-c">
          <a class="mr-10 flex-c" href="https://github.com/FUSIONFoundation/dcrm-go" target="_blank"><img src="@etc/img/GIT.svg" width="16" height="16"></a>
          <a class="flex-c" href="https://gitter.im/FUSIONDC/" target="_blank"><img src="@etc/img/GIT2.svg" width="16" height="16"></a>
        </li>
        <li>{{copyRight}}</li>
      </ul>
    </footer>

    <el-dialog
      :title="LANG.TITLE.CUSTOM_NODE"
      :visible.sync="networkVisible"
      width="30%"
      center>
      <el-input
        placeholder="HTTPS://"
        v-model="network"
        clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCustomNet">{{LANG.BTN.CANCEL}}</el-button>
        <el-button type="primary" @click="customNet">{{LANG.BTN.CONFIRM}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
export default {
  name: 'index',
  data () {
    return {
      copyRight: '2018 FUSION Foundation. All rights reserved.',
      walletAdress: '',
      walletAdressTop: '',
      language: '',
      languageOption: [
        {value: 'en', label: 'English'},
        {value: 'zh', label: '中文简体'}
      ],
      network: this.$$.baseUrl,
      networkOPtion: require('@etc/js/config/network').net,
      isRouterAlive: true,
      networkVisible: false,
      isSelectOrSet: true
    }
  },
  watch: {
    getAddress (cur, old) {
      if (cur) {
        this.walletAdress = cur
        this.walletAdressTop = this.$$.cutOut(cur, 6, 5)
        this.isSelectOrSet = false
      } else {
        this.isSelectOrSet = true
      }
      // console.log(this.isSelectOrSet)
    }
  },
  computed: {
    getAddress () {
      return this.$store.state.address
    }
  },
  mounted () {
    if (this.getAddress) {
      this.walletAdress = this.getAddress
      this.walletAdressTop = this.$$.cutOut(this.getAddress, 6, 5)
      this.isSelectOrSet = false
    } else {
      this.isSelectOrSet = true
    }
    // console.log(this.isSelectOrSet)

    this.setNetwort(this.network)
    this.language = localStorage.getItem('FUSION_WALLET_LANGUAGE_TYPE') ? localStorage.getItem('FUSION_WALLET_LANGUAGE_TYPE') : 'en'
  },
  methods: {
    reload() {
			this.isRouterAlive = false
			this.$nextTick(() => {
				this.isRouterAlive = true
			})
    },
    customNet () {
      this.$$.setWeb3(this.network)
      let networkId
      try {
        networkId = v_web3.version.network
        this.$store.commit("storeNetwork", {
          name: "Custom",
          url: this.network,
          chainId: networkId
        })
        this.$message({
          message: this.LANG.SUCCESS_TIP.TIP_2,
          type: 'success'
        })
      } catch (error) {
        this.network = this.$$.baseUrl
        this.setNetwort(this.network)
        this.$$.errTip(error)
      }
      this.networkVisible = false
    },
    cancelCustomNet () {
      this.networkVisible = false
      this.network = this.$$.baseUrl
      this.setNetwort(this.network)
    },
    changNetwork() {
      this.$store.commit("storeSafeMode", false)
      if (this.network === "https://") {
        this.networkVisible = true
      } else if (this.network === "offLine") {
        this.$store.commit("storeSafeMode", true)
      } else {
        this.setNetwort(this.network)
      }
    },
    setNetwort (val) {
      let _net = this.networkOPtion
      for (let i = 0; i < _net.length; i++) {
        if (_net[i].url === val) {
          this.$$.setWeb3(val)
          this.$store.commit("storeNetwork", _net[i])
          break
        }
      }
    },
    goBackupWallet () {
      this.$router.push('/backupWallet')
    },
    copyAddress (id, textId) {
      document.getElementById(id).select()
      document.execCommand('Copy')
      this.$message({
        message: this.LANG.SUCCESS_TIP.TIP_0,
        type: 'success'
      })
    },
    refreshPage () {
      this.$refs.nav.Refresh()
    },
    resetRefresh (data) {
      this.childRefresh = data
    },
    changLanguage () {
      localStorage.setItem('FUSION_WALLET_LANGUAGE_TYPE', this.language)
      this.changeLang(this.language)
      this.reload()
    },
    tobackupWallet () {
      this.$router.push({
        path: '/importWallet',
        query: {
          isBackup: true
        }
      })
    }
  }
}

</script>
