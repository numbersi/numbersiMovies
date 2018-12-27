const request = require('request-promise')
const cheerio = require('cheerio')
const {
  getPlayUrl
} = require('../lib/lib-getPlayUrl')
const baseUrl ='https://www.tv6.com'
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
  }
  
  async getHomeData(){
    const $ = await getHtml(baseUrl)
    const banner =[]
     $('.tv6-banner__item a').each(function(){
         banner.push({
             id:$(this).attr('href').split('.')[1].split('/').pop(),
             image:getBackroundImage($(this).css("background"))
        })
     })
     const a =  $('.container .row h3').text()
    $('.container .row ul ').each(function(){
      let vodlist_item =[]
      $(this).find('li').each(function(){
       const title = $(this).find('a').attr('title')
      })

     })
    return {banner,a}
  }

}

 function getBackroundImage(str){
   return baseUrl+ str.split("(")[1].split(")")[0]
}
async function getHtml(url) {
    const html = await request(url)
    return cheerio.load(html)
  
  }