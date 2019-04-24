let languageType = localStorage.getItem('WALLET_LANGUAGE_TYPE')
let langData
if (languageType === 'en') {
  langData = require('@/assets/js/language/en')
} else if (languageType === 'zh') {
  langData = require('@/assets/js/language/zh')
} else {
  langData = require('@/assets/js/language/en')
}

// console.log(langData)
export default langData
