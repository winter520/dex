import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

// const navLeft = resolve =>
//   require.ensure([], () => resolve(require('@/components/nav')), 'group-wallet')
const walletEnter = resolve =>
  require.ensure([], () => resolve(require('@/components/index')), 'group-wallet')

// const biticonView = resolve =>
//   require.ensure([], () => resolve(require('@/components/createWallet/index')), 'group-wallet')
// const createWallet = resolve =>
//   require.ensure([], () => resolve(require('@/components/createWallet/create')), 'group-wallet')
// const saveKeystore = resolve =>
//   require.ensure([], () => resolve(require('@/components/createWallet/savekeystore')), 'group-wallet')
const importWallet = resolve =>
  require.ensure([], () => resolve(require('@/components/password/import')), 'group-exchange')

// const myAssets = resolve =>
//   require.ensure([], () => resolve(require('@/components/myAssets/index')), 'group-wallet')

// const transfer = resolve =>
//   require.ensure([], () => resolve(require('@/components/transfer/index')), 'group-wallet')
// const tranReceive = resolve =>
//   require.ensure([], () => resolve(require('@/components/transfer/receive')), 'group-wallet')
// const tranSend = resolve =>
//   require.ensure([], () => resolve(require('@/components/transfer/send')), 'group-wallet')

// const lilo = resolve =>
//   require.ensure([], () => resolve(require('@/components/lilo/index')), 'group-wallet')
// const coinList = resolve =>
//   require.ensure([], () => resolve(require('@/components/lilo/coinList')), 'group-wallet')
// const lockIn = resolve =>
//   require.ensure([], () => resolve(require('@/components/lilo/lockIn')), 'group-wallet')
// const lockOut = resolve =>
//   require.ensure([], () => resolve(require('@/components/lilo/lockOut')), 'group-wallet')
// const lockNav = resolve =>
//   require.ensure([], () => resolve(require('@/components/lilo/lockNav')), 'group-wallet')

// const dapp = resolve =>
//   require.ensure([], () => resolve(require('@/components/dapp/index')), 'group-wallet')

// const backupWallet = resolve =>
//   require.ensure([], () => resolve(require('@/components/backupWallet/index')), 'group-wallet')

const exchangeEnter = resolve =>
  require.ensure([], () => resolve(require('@/components/exchange/index')), 'group-exchange')
const top = resolve =>
  require.ensure([], () => resolve(require('@/components/exchange/top')), 'group-exchange')
const right = resolve =>
  require.ensure([], () => resolve(require('@/components/exchange/right')), 'group-exchange')
const bottom = resolve =>
  require.ensure([], () => resolve(require('@/components/exchange/bottom')), 'group-exchange')
const left = resolve =>
  require.ensure([], () => resolve(require('@/components/exchange/left')), 'group-exchange')
const middle = resolve =>
  require.ensure([], () => resolve(require('@/components/exchange/middle')), 'group-exchange')


const hw = resolve =>
  require.ensure([], () => resolve(require('@/components/HelloWorld')), 'group-wallet')

Vue.use(Router)

const routers = new Router({
  // mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   component: walletEnter,
    //   children: [
    //     { path: '/', component: biticonView },
    //     { path: '/biticonView', name: 'biticonView', component: biticonView },
    //     { path: '/createWallet', name: 'createWallet', component: createWallet },
    //     { path: '/importWallet', name: 'importWallet', component: importWallet },
    //     { path: '/saveKeystore', name: 'saveKeystore', component: saveKeystore },
    //     { path: '/nav', component: navLeft, 
    //       children: [
    //         { path: '/', component: myAssets },
    //         { path: '/MyAssets',  name: 'MyAssets', component: myAssets },
    //         { path: '/Transfer', component: transfer, 
    //           children: [
    //             { path: '/', component: tranReceive },
    //             { path: '/Transfer/tranReceive', name: 'tranReceive', component: tranReceive },
    //             { path: '/Transfer/tranSend', name: 'tranSend', component: tranSend }
    //           ]
    //         },
    //         { path: '/LILO', component: lilo,
    //           children: [
    //             { path: '/', component: coinList },
    //             { path: '/lockNav', component: lockNav,
    //               children: [
    //                 { path: '/', component: lockIn }, 
    //                 { path: '/LILO/lockIn', name: 'lockIn', component: lockIn },
    //                 { path: '/LILO/lockOut', name: 'lockOut', component: lockOut }
    //               ]
    //             }
    //           ]
    //         },
    //         { path: '/DAPP', name: 'DAPP', component: dapp },
    //         { path: '/backupWallet', name: 'backupWallet', component: backupWallet }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/index',
      component: walletEnter,
      children: [
        { path: '/', name: 'importWallet', component: importWallet },
        { path: '/importWallet', name: 'importWallet', component: importWallet }
      ]
    },
    {
      path: '/',
      component: exchangeEnter,
      children: [
        {
          path: '/',
          components: {
            default: top,
            right: right,
            bottom: bottom,
            left: left,
            middle: middle
          }
        }
      ]
    },
    {
      path: '/hw', name: 'HelloWorld', component: hw
    }
  ]
})
// let count = 0
// routers.beforeEach((to, from, next) => {
//   const hideSearchURL = ['/biticonView', '/createWallet', '/importWallet', '/saveKeystore', '/exchange', '/hw']
//   if (store.state.address) {
//     next()
//   } else {
//     let toFlag = false
//     for (let i of hideSearchURL) {
//       if (to.path.toUpperCase().indexOf(i.toUpperCase()) !== -1 || to.path.toUpperCase() === '/') {
//         toFlag = true
//         break
//       }
//     }
//     if (toFlag) {
//       next()
//     } else {
//       next('/')
//     }
//   }
// })

export default routers
