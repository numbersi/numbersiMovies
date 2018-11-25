const router = require('koa-router')()
var request = require('request-promise');
var cheerio = require('cheerio');
var {resolve} = require('path')
const { exec } = require('child_process');

// var Buffer = require('buffer')
router.prefix('/search')

router.get('/movie/:kw', async (ctx, next) => {
//    动态路由 获取关键词 
    kw=ctx.params.kw
    let data =await searchDataFrom360kan(kw)
    await ctx.render('search',{data:data})

})

router.get('/play/:type/:tabs', async (ctx,next)=>{
    tabs=ctx.params.tabs
    type=ctx.params.type
    tabs = decodeTab(tabs)
    let seriesNumbers ={}
    let playTemplet= 'dianshi-dianying'
    for(let i = 0; i　< tabs.length; i++) {
        tab = tabs[i]
        tab =tab.split('_').splice(1).sort((a,b)=>{})
        let url =null 
        switch (type) {
            case "zongyi":
                url= await getZongyiSeriesNumber(tab)
                playTemplet= 'zongyi'
                break;
            case "dianying":
                url= await getZongyiSeriesNumber(tab)
                break;
            case "dianshi":
                url= await getDianshiSeriesNumber(tab)
                break;
            default:
                break;
        }
        console.log('url',url);
        
        seriesNumbers[tab[2]]=url
    }
    
    await ctx.render ('play',{tabs:Object.keys(seriesNumbers),seriesNumbers:seriesNumbers,playTemplet:playTemplet}) 
})
router.get('/getPlayUrl',async (ctx,next)=>{
    url=ctx.query.url
    const {getPlayUrl} = require('../lib/lib-getPlayUrl')
    const playUrl=  await getPlayUrl(ctx.query)
    // type = ctx.query.type
    // let jiekou ='http://app.baiyug.cn:2019/vip/index.php?url='
    // if(type){
    //     jiekou= 'http://api.bbbbbb.me/jx/?url='  
    // }
    // const util = require('util');
    // const execFile = util.promisify(require('child_process').execFile);
    // const script = resolve(__dirname,'../crawler/playUrl.js')
    // const { stdout } = await execFile('node', [script,jiekou+url]);
    // console.log(stdout);
    ctx.body=playUrl
})

// 加密 encodeUrl
function encodeTab(tabs){
    
    return new Buffer(tabs.join('$')).toString('base64');
}
// 解密
function decodeTab(codeTab){
    let tabs =  new Buffer(codeTab, 'base64').toString().split('$')
    return tabs.sort(function(a,b){return b.length - a.length;});
}
async function  searchDataFrom360kan(kw){
    // url = `https://so.360kan.com/index.php?kw=${kw}&from=`
    url ='https://so.360kan.com/index.php?kw='+encodeURIComponent(kw)+'&from='
    console.log(url);
    
    const html  =  await request(url)
    var $ = cheerio.load(html)
    var movieList = [];

    ['zongyi','dianying','dianshi'].forEach((type)=>{
        $('.index-'+type).each(function(){
            let $this = $(this);
            movieList = aa($,$this,movieList,type)
        })
    // $('.index-zongyi').each(function(){
    //     let $this = $(this);
    //     movieList = aa($,$this,movieList,)
    // })
    // $('.index-dianying').each(function(){
    //     let $this = $(this);
    //     movieList = aa($,$this,movieList)
       
    // })
    // $('.index-dianshi').each(function(){
    //     let $this = $(this);
    //     movieList = aa($,$this,movieList)
    // })
    })
    return movieList
}
function aa($,dom,movieList,type){
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
        // url:url,
        moviePic:moviePic,
        type:type,
        title:title,
        playtype:playtype,
        // score:score,
        // description:description,
        // area:area,
        // actor:actor,
        tabs:encodeTab(tabs)
    })
    return movieList
}
async function getZongyiSeriesNumber(tab){
    url ='https://www.360kan.com/cover/zongyilistv2?id='+tab[1]+'&site='+tab[2]+'&do=switchsite&isByTime=true'
    const html  =  await request(url)
    var $ = cheerio.load(JSON. parse(html).data)
    let seriesNumber ={}
    $('.js-link').each(function(k){
        const href =$(this).attr('href')
        const hint =$(this).find('.w-newfigure-hint').text()
        const title =$(this).find('.s1').text()
        const img =$(this).find('img').data('src')
        item={
            href:href,
            title : title,
            img : img
        }
        seriesNumber[hint] = item
        
    })
    return seriesNumber
}
async function getDianshiSeriesNumber(tab){
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
