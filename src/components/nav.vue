<template>
  <div class="boxConntent1 navBox">
    <nav class="navLeft_box">
      <ul>
        <li><router-link to="/MyAssets" class="item flex-ai-c"><div class="icon"><img src="@etc/img/MyAssets.svg"></div><p>{{LANG.NAV.MY_ASSETS}}</p></router-link></li>
        <li><router-link to="/Transfer" class="item flex-ai-c"><div class="icon"><img src="@etc/img/Transfer.svg"></div><p>{{LANG.NAV.TRANSFER}}</p></router-link></li>
        <li><router-link to="/LILO" class="item flex-ai-c"><div class="icon"><img src="@etc/img/LILO.svg"></div><p>{{LANG.NAV.LILO}}</p></router-link></li>
        <li><router-link to="/DAPP" class="item flex-ai-c"><div class="icon"><img src="@etc/img/DAPP.svg"></div><p>{{LANG.NAV.DAPP}}</p></router-link></li>
        <li><router-link to="/exchangeEnter" class="item flex-ai-c"><div class="icon"><img src="@etc/img/DAPP.svg"></div><p>Exchange</p></router-link></li>
      </ul>
    </nav>
    <div class="navContent_box">
      <!-- <div class="bgLoading flex-c"><div style="text-align: center;"><div class="rotateLoad"><img src="static/img/wait.svg"></div><p style="margin-top:15px;font-size:16px;font-weight:bold;color:#333;padding-left:12px;">Loading…</p></div></div> -->
      <div style="width:100%;height:100%;position:absolute;top:0;left:0;overflow:auto;overflow-x:hidden;">
        <div style="width:100%;height:100%;position:relative;">
          <transition name="fade">
            <router-view v-if="childRefresh"></router-view>
          </transition>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'navLeft',
  data () {
    return {
      childRefresh: true
    }
  },
  methods: {
    Refresh (data) {
      this.$store.commit("storeWalletLoadFlag", true)
      this.childRefresh = false
			this.$nextTick(() => {
				this.childRefresh = true
			})
    }
  }
}
</script>

