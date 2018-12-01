module.exports = {

  host:'http://tv.numbersi.cn',//'http://127.0.0.1:4444',///
  port :3008,
  db:'mongodb://numbersi:a4851217@ds031108.mlab.com:31108/wechat7',
  wechat: {
    appID: 'wx6b2b1a8cc619de79',
    appSecret: 'c4212df8b8902783840a4cee8aa42730',
    token: 'imoocisareallyamzingplacetolearn'
  },
  sources:{
    'zuida':'http://www.zdziyuan.com/inc/api_zuidam3u8.php',
    'tv6':'http://v10.tv6.com/api.php/provide/vod/at/xml/',
  },
}
