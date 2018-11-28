const base = 'https://kan.2345.com/'
const request = require('request-promise')
const cheerio =require('cheerio')
module.exports = class  Crawler360kan{
  /**
   * 思考：如何用有 异步 方法这只 属性。
   */
   constructor(options){
    console.log("****************************",options)
    this.wd= options.wd 
  }

  async searchApi(){
    let url ='http://video.360kan.com/suggest.php?fmt=jsonp&ac=richsug&kw='+encodeURIComponent(this.wd)
    const result = await request(url)
    console.log( )
    return JSON.parse(/{.*}/i.exec(result)[0])
    
  }
  async searchByWd(){
    
    const url ='https://so.360kan.com/index.php?kw='+encodeURIComponent(this.wd)+'&from='
    console.log(url);
    
    const html  =  await request(url)
    var $ = cheerio.load(html)
    var movieList = []; 

    ['zongyi','dianying','dianshi'].forEach((type)=>{
      $('.index-'+type).each(function(){
          let $this = $(this);
          movieList =jsHtml($,$this,movieList,type)
      })
    })

  
    console.log(movieList);
    
    return movieList
 
  }

  
  async Jx(res){
    const resJson = JSON.parse(res)
    let tvData = []
    console.log(resJson);
    // resJson.forEach(item => {
        // const year = item.year?item.year:''
        // let  actor = item.actor?item.actor:''
    //     if (actor){
    //       actor =  actor.split('&nbsp;&nbsp;').join(',')
    //     }
    //     tvData.push({
    //       title:item.title,
    //       description:`${year}年 主演: ${actor}`,
    //       picUrl:'http:'+item.img,
    //       url:item.xqurl
    //     })
    // });
    if (res.length){
     
      const year =  resJson[0].year?resJson[0].year:''
      let  actor =  resJson[0].actor?resJson[0].actor:''
              if (actor){
          actor =  actor.split('&nbsp;&nbsp;').join(',')
        }
      return [{
             title:resJson[0].title,
          description:`${year}年 主演: ${actor}`,
          picUrl:'http:'+resJson[0].img,
          url: require('../config/config').host+'/play?url='+resJson[0].xqurl
        
      }]

    }
    return '没有搜索到你输入的内容，请尽可能完整的输入影片的名字'
  }
  
  //电影 

  //综艺
  //电视剧
}
function jsHtml($,dom,movieList,type){
    var $this = dom
    const moviePic  = $this.find('.m-mainpic a img').attr("src")
    const cont =$this.find('.cont')
    const titleDom = cont.find('.title')
    const title = titleDom.find('a b').text()
    const playtype =titleDom.find('.playtype').text()
    // const score = titleDom.find('.m-score').text()
    // const description =cont.find('.m-description p').text()
    // const area = cont.find('.area').text()
    // const actor =cont.find('.actor').text()
    const dropmenu=  cont.find('.dropmenu')
    let  tabs =[]
    let tab = null  
    if(!dropmenu.text()){
      tab = cont.find('.ea-site').data('tab')
      tabs.push(tab)
    }else{
        dropmenu.find('a').each(function(){
        tab=  $(this).data('tab')
        tabs.push(tab)
      })
    }
    movieList.push({
        moviePic:moviePic,
        type:type,
        title:title,
        playtype:playtype,
    })
    return movieList
}