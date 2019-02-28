const request = require('request-promise')
const cheerio = require('cheerio')
 class Collect{


}
 const getDBVodByID = async function (id) {
    return await request.get("http://api.douban.com/v2/movie/"+id)
 }
 const getchart = async function () {
    const url = 'https://movie.douban.com/chart';
    const $ = cheerio.load(await request.get(url))
    const ranking = $("#ranking #ranking")
    console.log(ranking.length)
    let chart = []
  
    ranking.each((index, item) => {
      //排除子元素
      const title  =$(item).find("h2").children()[0].prev.data.replace(/[\r\n]/g, '').replace(/\s+/g, "")  
      const des  = $(item).find("h2 span").text().replace(/[\r\n]/g, '').replace(/\s+/g, "") 
      const list = $(item).find(".clearfix")
      console.log(list.length)
      let items =[]
      list.each(function (index, item) {
        const a = $(item).find('a')
        const id = /[0-9]{5,8}/.exec(a.attr('href'))[0]
        const no = $(item).find('.no').text().replace(/[\r\n]/g, '').replace(/\s+/g, "") //排名
        const name = a.text().replace(/[\r\n]/g, '').replace(/\s+/g, "") //名字
        const s = $(item).find('span').text().replace(/[\r\n]/g, '').replace(/\s+/g, "") //上升 stay
       
        items.push( {
          id,
          no,
          name,
          s
        })
      })

      chart.push({title,des,items})
    })
    return chart
  }
  
module.exports= {
    Collect,getchart,getDBVodByID
}