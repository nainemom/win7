const pkg = require('./package')


module.exports = {
  mode: 'spa',
  router: {
    base: '/winvista/'
  },
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [
  ],
  plugins: [
  ],
  modules: [
    '@nuxtjs/pwa',
  ],
  build: {
    extend(config, ctx) {
      
    }
  },
  generate: {
    dir: 'docs'
  }
}
