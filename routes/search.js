const router = require('koa-router')()
var request = require('request-promise');
var cheerio = require('cheerio');
// var Buffer = require('buffer')
router.prefix('/search')

router.get('/movie/:kw', async (ctx, next) => {
//    动态路由 获取关键词 
    kw=ctx.params.kw
    let data =await searchDataFrom360kan(kw)
    // await ctx.render('search',{data:data})
    ctx.body=data

})

router.get('/play/:urlCode', async (ctx,next)=>{
    urlCode=ctx.params.urlCode
    tabs = decodeTab(urlCode)
    let seriesNumbers ={}

    for(let i = 0; i　< tabs.length; i++) {
        tab = tabs[i]
        tab =tab.split('_').splice(1)
        const url = await getSeriesNumber(tab)
        seriesNumbers[tab[2]]=url
    }

    // 这个方法  seriesNumbers 无效 
    // await tabs.forEach(async (tab,k) => {
    //    tab =tab.split('_').splice(1)
    //    const url = await getSeriesNumber(tab)
    //    seriesNumbers[tab[2]]=url
    // });
    
    await ctx.render ('play',{tabs:Object.keys(seriesNumbers),seriesNumbers:seriesNumbers}) 
})

// 加密 encodeUrl
function encodeTab(tabs){
    
    return new Buffer(tabs.join('$')).toString('base64');
}
// 解密
function decodeTab(codeTab){
    return new Buffer(codeTab, 'base64').toString().split('$')
}
async function  searchDataFrom360kan(kw){
    // url = `https://so.360kan.com/index.php?kw=${kw}&from=`
    url ='https://so.360kan.com/index.php?kw=%E7%A7%A6%E6%97%B6%E6%98%8E%E6%9C%88&from='

    const html  =  await request(url)
    var $ = cheerio.load(html)
    var movieList = [];
    $('.index-dianying').each(function(){
        let $this = $(this);
        movieList = aa($,$this,movieList)
       
    })
    $('.index-dianshi').each(function(){
        let $this = $(this);
        movieList = aa($,$this,movieList)
       
    })
    return movieList
}
function aa($,dom,movieList){
    var $this = dom
    const moviePic  = $this.find('.m-mainpic a img').attr("src")
    const cont =$this.find('.cont')
    const titleDom = cont.find('.title')
    const title = titleDom.find('a b').text()
    const playtype =titleDom.find('.playtype').text()
    const score = titleDom.find('.m-score').text()
    const description =cont.find('.m-description p').text()
    const area = cont.find('.area').text()
    const actor =cont.find('.actor').text()
    const dropmenu=  cont.find('.dropmenu')
    let  tabs =[]
    let tab = null  
    if(!dropmenu.text()){
      tab =   cont.find('.ea-site').data('tab')
      tabs.push(tab)
    }else{
        dropmenu.find('a').each(function(){
        tab=  $(this).data('tab')
        tabs.push(tab)
      })
    }
    movieList.push({
        // url:url,
        moviePic:moviePic,
        title:title,
        playtype:playtype,
        score:score,
        description:description,
        area:area,
        actor:actor,
        tabs:encodeTab(tabs)
    })
    return movieList
}
async function ss(){

}
async function getSeriesNumber(tab){
    url ='https://www.360kan.com/cover/switchsitev2?site='+tab[2]+'&id='+tab[1]+'&category='+tab[0]
    // return
                 ////console.log(url)
    const html  =  await request(url)
    var $ = cheerio.load(JSON. parse(html).data)
    let seriesNumber ={}
    $('.num-tab-main a').each(function(k){
            if(k){
                const num = $(this).data('num')  
                if(num){
                    seriesNumber[num]=$(this).attr('href')
                }
            }
               
        })
    ////console.log(seriesNumber)
    return seriesNumber
    } 
    // url= 'https://so.360kan.com/episodesv2',
    // request.post('url',data)
module.exports = router
