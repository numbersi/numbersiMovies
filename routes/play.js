const router = require('koa-router')()
var request = require('request-promise');
var cheerio = require('cheerio');
// var {getPlayUrl} = require('../lib/lib-getPlayUrl');
var {resolve} = require('path')
const { exec } = require('child_process');
var iconv = require('iconv-lite');  

// var Buffer = require('buffer')
router.prefix('/play')
router.get('/', async (ctx, next) => {
  url=ctx.query.url
  //  获取 qurey 2345 地址
  const res = request(url)
  
  // request 获取 html
  // 解析 html 得到 主要数据
    const data = await getDataBy2345Url(url)
  //  返回 模版
  // ctx.body = data
  await ctx.render(data.template,data.data)
})

async function getDataBy2345Url(url){
  const urlType = url.split('//')[1].split('.')[0]
  const html  =  await request({url, encoding: null})
  let data
  let template 
  switch (urlType) {
    case 'dianying':
    data =  await jxDianying(html)
    template='dianying'
      break;
    case 'tv':
    data = await jxTv(html)
    template='tv'
      break;
    case 'kan':
    data = await jxZongyi(html)
    template='zongyi'
      break;
    default:
      break;
  }
  console.log(data);
  return {template,data}
}

async function jxTv(html){
  const playSources = ['mgtv_con','youku_con','qq_con','qiyi_con','pptv_con']
  var $ = cheerio.load(iconv.decode(html, 'gb2312'))
  const img = $('.pic img').attr('src')
  const title = $('.tit a').attr('title')
  const emNum = $('.emNum').text().trim()
  let playNumList=[]
  for (let index = 0; index < playSources.length; index++) {
    const itemSource = playSources[index];
    playNumList_element = $(`#${itemSource}`)
    
    if (playNumList_element.text()){
      $(playNumList_element).find('a').each((index,a)=>{
            const  num = $(a).find('.num').text().trim()
            const  playLink = $(a).attr('href').split('?')[0]
            const  playLinkTitle = $(a).attr('title')
          if (num){
            playNumList.push({num,playLink , playLinkTitle})
          }
      })
      break
    }
  }
  const allData = {
    img,
    title,
    emNum,
    playNumList: playNumList . reverse() ,
  }
  return allData
}
async function jxDianying(html){
  // 顺序表
  const playSources = ['mgtv_0','youku_0','qq_0','mgtv_0','qiyi_0','pptv_0']
  var $ = cheerio.load(iconv.decode(html, 'gb2312'))
  let playSourceUrl  =''
  for (let index = 0; index < playSources.length; index++) {
    // 优先获取 顺序，
    let playSource = playSources[index];
    const element_a = $(`a[data="${playSource}"]`)
    console.log(element_a);
    if(element_a.text()){
       playSourceUrl = element_a.attr('href')
      break;
    }
  }
  return {playLink:playSourceUrl}
}
async function jxZongyi(html){
  
}
module.exports = router
