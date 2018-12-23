const request = require('request-promise')
const cheerio = require('cheerio')
const { md5 } = require('./util')

const {
  getPlayUrl
} = require('../lib/lib-getPlayUrl')
module.exports = class Crawler360kan {

  /**
    * 思考：如何用有 异步 方法这只 属性。
    */
  constructor(options) {
    if (options) {
      const {
        wd
      } = options
      this.wd = wd
    }

    this.baseUrl = 'https://www.360kan.com'

  }


  async getListData(pageno, type) {
    const data = await getItemList(pageno, type)
    return data
  }


  async getDetialData(href) {
    const type = href.split('/')[1]
    switch (type) {
      case 'm':
        return this.DyDetial(href)
      case 'tv':
        return this.TvDetial(href)
      case "va":
        return this.ZyDetail(href)
    }
  }

  async checkMd5Html(type, md5_html) {
    const url = 'https://www.360kan.com/' + type + '/list.php?rank=rankhot&cat=all&area=all&act=all&year=all&pageno=1'
    const html = await getHtml(url)
    const new_md5_html = md5(html)
    const flag = (new_md5_html == md5_html)
    console.log('****',new_md5_html,md5_html);
    
    if (!flag) {
      let list_movie = extractMovieList(html)
      const data={
        list_movie,
        md5_html:new_md5_html
      }
      return {
        flag,
        data
      }
    }

    return {
      flag
    }

  }

  async searchApi() {
    let url = 'https://video.360kan.com/suggest.php?fmt=jsonp&ac=richsug&kw=' + encodeURIComponent(this.wd)

    const result = await request(url)
    console.log(result)
    if (result.includes('hanju.cc')) {
      return "没找到2"
    }
    let data = JSON.parse(/{.*}/i.exec(result)[0])
    if (data.errno) {
      return "没找到"
    }
    data = await extractData(data)
    return data
  }
  async searchByWd() {
    const url = 'https://so.360kan.com/index.php?kw=' + encodeURIComponent(this.wd) + '&from='
    console.log(url);
    const html = await request(url)
    var $ = cheerio.load(html)
    var movieList = [];
    ['zongyi', 'dianying', 'dianshi'].forEach((type) => {
      $('.index-' + type).each(function () {
        let $this = $(this);
        movieList = jsHtml($, $this, movieList, type)
      })
    })
    console.log(movieList);
    return movieList
  }
  async Jx(res) {
    const resJson = JSON.parse(res)
    let tvData = []
    console.log(resJson);
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
        url: require('../config/config').host + '/play?url=' + resJson[0].xqurl
      }]
    }
    return '没有搜索到你输入的内容，请尽可能完整的输入影片的名字'
  }
  //电影 
  async DyDetial(href) {
    const url = this.baseUrl + href
    const { md5_html, $ } = await getCheerioMd5(url)
    const title = $('.title-left h1').text()
    const item_desc = $('.js-close-wrap .item-desc')
    item_desc.find('a').remove()
    const desc = item_desc.text()
    let list_daochu = ['to=imgo', 'to=qiyi', 'to=youku', 'to=qq']
    let img = $('.top-left').find('img').attr('src')
    // for (let index = 0; index < playSources.length; index++) {

    // }
    let list_palyUrl = []
    $('.top-list-zd a').each(function () {
      let daochu = $(this).data('daochu')
      let href = $(this).attr('href')
      if (daochu) {
        list_palyUrl[daochu] = href
      }
    })
    let playUrl
    for (let index = 0; index < list_daochu.length; index++) {
      const element = list_daochu[index];
      playUrl = $('.top-list-zd').find('a[data-daochu="' + element + '"]').attr('href')
      if (playUrl) {
        //  playUrl=  await getPlayUrl({url:playUrl})
        break
      }
    }

    console.log(list_palyUrl);
    return {
      title,
      desc,
      playUrl,
      img,
      category: 'm',
      md5_html
    }
  }
  //综艺
  async ZyDetail(href) {
    const url = this.baseUrl + href

    const { md5_html, $ } = await getCheerioMd5(url)
    const item_desc = $('.item-desc')
    item_desc.find('a').remove()
    const title = $('.title-left h1').text()
    const desc = item_desc.text()
    const month_list = []
    $('.js-month').each(function () {
      month_list.push($(this).text())
    })
    const year_list = []
    $('.js-year-item').each(function () {
      year_list.push($(this).text())
    })
    const year = $('.js-year-now').text()
    const month_pages = []
    $('.js-month-tab').each(function () {
      const month_page = []
      $(this).find('li').each(function () {
        const title = $(this).attr('title')
        const hint = $(this).find('.w-newfigure-hint').text()
        const href = $(this).find('a').attr('href')
        let img = $(this).find('img').data('src')
        if (img.startsWith('https://p.ssl.so.com/p/')) {
          img = decodeURIComponent(img.substr('https://p.ssl.so.com/p/'.length))
        }
        console.log(img);

        month_page.push({
          title, hint, img, href
        })
      })
      month_pages.push(month_page)
    })


    return {
      desc, title,
      month_page_list: {
        month_pages, month_list, year_list, year,
      },

      category: 'zy'
    }

  }
  //电视剧
  async TvDetial(href) {
    const url = this.baseUrl + href
    const category = 2
    const id = href.split('/')[2].split('.')[0]

    const siteArr = {
      '芒果TV': 'imgo',
      '腾讯': 'qq',
      '爱奇艺': 'qiyi',
      'PP视频': 'pptv',
      '搜狐': 'sohu',
      'CNTV': 'cntv',
      '风行': 'fengxing',
      '优酷': 'youku', '乐视': 'levp'
    }
    let { md5_html, $ } = await getCheerioMd5(url)
    const img = $('.s-top-dianshi img').attr('src')
    const tag =$('.s-top-dianshi .tag').text()

    if(tag.indexOf("全") != -1){
      md5_html = null
    }
    const title = $('.s-top-dianshi h1').text()
    const item_desc = $('.item-desc')
    item_desc.find('a').remove()
    const desc = item_desc.text()
    const siteText = $('.js-current  span').text()
    const site = siteArr[siteText]
    const play_list = await switchsite({
      site,
      id,
      category
    })
    return {
      img,
      title,
      desc,
      category: 'tv',
      play_list,md5_html
    }
  }

}

function jsHtml($, dom, movieList, type) {
  var $this = dom
  const moviePic = $this.find('.m-mainpic a img').attr("src")
  const cont = $this.find('.cont')
  const titleDom = cont.find('.title')
  const title = titleDom.find('a b').text()
  const playtype = titleDom.find('.playtype').text()
  // const score = titleDom.find('.m-score').text()
  // const description =cont.find('.m-description p').text()
  // const area = cont.find('.area').text()
  // const actor =cont.find('.actor').text()
  const dropmenu = cont.find('.dropmenu')
  let tabs = []
  let tab = null
  if (!dropmenu.text()) {
    tab = cont.find('.ea-site').data('tab')
    tabs.push(tab)
  } else {
    dropmenu.find('a').each(function () {
      tab = $(this).data('tab')
      tabs.push(tab)
    })
  }
  movieList.push({
    moviePic: moviePic,
    type: type,
    title: title,
    playtype: playtype,
  })
  return movieList
}
// 根据类型提取data
async function extractData(data) {
  if (data.data) {
    if (data.data.detail) {
      x
      return data
    }
  }
  return {
    "errno": 0,
    "msg": "没有搜到想要的结果",
    "data": null,
    status: false
  }
}

async function getHtml(url) {
  const html = await request(url)

  return html
}

async function getCheerioMd5(url) {
  const html = await getHtml(url)

  return {
    md5_html: md5(html),
    $: cheerio.load(html)
  }
}
async function getItemList(pageno, type) {
  url = 'https://www.360kan.com/' + type + '/list.php?rank=rankhot&cat=all&area=all&act=all&year=all&pageno=' + pageno
  console.log(url);
  const html = await getHtml(url)
  let list_movie = extractMovieList(html)

  if (pageno == 1) {
    const md5_html = md5(html)
    return { list_movie, md5_html }
  }
  return { list_movie }
}
function extractMovieList(html) {
  let list_movie = []

  const $ = cheerio.load(html)
  const role = 'li[class="item"]'
  let img
  let title
  let star
  $(role).each(function () {
    img = $(this).find('img').attr('src')
    title = $(this).find('.s1').text()
    star = $(this).find('.star').text()
    let hint = $(this).find('.hint').text()
    let point = $(this).find('.point').text() || ''
    let href = $(this).find('a').attr('href') || ''
    list_movie.push({
      href,
      img,
      title,
      star,
      hint,
      point
    })
  })
  return list_movie

}

async function switchsite(params) {
  url = 'https://www.360kan.com/cover/switchsitev2'
  const res = await request({ uri: url, qs: params })
  var $ = cheerio.load(JSON.parse(res).data)
  const list_a = $('a')
  let play_list = []
  let numIndex = 1
  list_a.each(function () {
    let num = $(this).data('num')
    let playUrl = $(this).attr('href')
    if (num) {
      num = parseInt(num)
      if (num == numIndex) {
        let newItem = {
          num: num,
          playUrl
        }
        play_list.push(newItem)
        numIndex = num + 1
      }
    }
  })

  return play_list
}
