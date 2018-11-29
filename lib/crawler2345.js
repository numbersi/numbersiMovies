const base = 'https://kan.2345.com/'
const request = require('request-promise')

const { getDwz } = require('../lib/util')

module.exports = class Crawler2345 {

  constructor(key) {
    console.log("****************************")

  }
  // 关键词搜索
  async searchByKey(key) {
    console.log(key)

    const url = `http://kan.2345.com/moviecore/server/search/?q=${encodeURIComponent(key)}&ctl=think&querytype=suggest`
    let tvData = []
    try {
      const res = await request(url)
      console.log('###########', typeof (res));

      if (res == '[]') {
        return '没有搜索到你输入的内容，请尽可能完整的输入影片的名字,如 如懿传，我不是药神，快乐大本营(((现在仅支持腾讯优酷芒果爱奇艺里的资源)))'
      }
      tvData = await this.Jx(res)
    } catch (err) {
      console.log(err);
    }
    return tvData
  }
  async Jx(res) {
    const resJson = JSON.parse(res)
    let tvData = []

    if (resJson) {

      const url_long = require('../config/config').host + '/play?url=' + resJson[0].xqurl
      const url_short = await getDwz(url_long)

      if (res.length) {
        const year = resJson[0].year ? resJson[0].year : ''
        let actor = resJson[0].actor ? resJson[0].actor : ''
        if (actor) {
          actor = actor.split('&nbsp;&nbsp;').join(',')
        }
        return [{
          title: resJson[0].title,
          description: `${year}年 主演: ${actor}`,
          picUrl: 'http:' + resJson[0].img,
          url: url_short
        }]
      }
    }

    //电影 

    //综艺
    //电视剧
  }
}
