const { readdirSync } = require('fs')

module.exports = {
  exportPathMap: function() {
    let pages = {
      '/': { page: '/' },
      '/menu': { page: '/menu' },
      '/events': { page: '/events' },
      '/videos': { page: '/videos' },
      '/video': { page: '/video' },
      '/about': { page: '/about' },
      '/speakers': { page: '/speakers' },
      '/code-of-conduct': { page: '/code-of-conduct' },
      '/presentations': { page: '/presentations' },
      '/presentation': { page: '/presentation' },
      '/speaker': { page: '/speaker' },
      '/guidelines': { page: '/guidelines' },
      '/login': { page: '/login' },
      '/login-forward': { page: '/login-forward' },
      '/search': { page: '/search' },
      '/contact': { page: '/contact' },
      '/learn': { page: '/learn' },
      '/profile': { page: '/profile' },
      '/manage/index': { page: '/manage/index' },
      '/manage/user': { page: '/manage/user' }
    }
    const archive = readdirSync('./pages/archive')
    for (let page in archive) {
      if (archive[page] !== '_data.json') {
        pages['/archive/' + archive[page].replace('.js', '')] = {
          page: '/archive/' + archive[page].replace('.js', '')
        }
      }
    }

    return pages
  }
}
