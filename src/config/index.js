export default {
  url: {
    app: process.env.NODE_ENV === 'production' ? '/' : 'https://qa.dev',
    api: process.env.NODE_ENV === 'production' ? '/' : 'https://api.qa.dev'
  },
  search: {
    appId: 'T2TA5RNB5Y',
    apiSecret: '9568ab295bfd78bcb6fefb2be99d33a6'
  }
}
