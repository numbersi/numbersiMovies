const {resolve} = require('path')
const mongoose = require('mongoose')
const sha1 = require('sha1');
const request = require('request')
const puppeteer = require('puppeteer')
const PlayUrlModel = mongoose.model('PlayUrl')
async function getPlayUrl (options){
    const {url} = options
    
    let raw_url = format_url(url)
    let  playUrl  =  await PlayUrlModel.findOne({
        raw_url:raw_url
    })
    if(!playUrl){
        console.log('没有数据，爬取 ');
        playUrl =   await savePlayUrl(options,raw_url)
    }else{
        console.log('检查时效性')
        const isVaild = await isVaildPlayUrl(playUrl)
        if(!isVaild){
            console.log('开始更新', playUrl.play_url);
            playUrl.play_url =   await updatePlayUrl(options,raw_url)
            console.log('开始结束', playUrl.play_url);
        }
    }

    console.log("########",playUrl);
    let play_url = playUrl.play_url
    return {play_url}||'没有找到'
}
// 从数据库中获取播放地址
// async function getPlayB
//验证 播放地址的有效性
async function isVaildPlayUrl(playUrl){
    const arr = [
                    'https://1251883823.vod2.myqcloud.com/9dae6688vodgzp1251883823/70213cda5285890781965629452/7pdYUOrVSfYA.mp4',
                    'http://www.cmys.tv',
                    'blog.zhaiyou',
                    'http://218.61.35.88/w/7461d48fdc7f30fe9d1d8fbaae558a3f.mp4?type=tv.android&key=9fbdb416df86e28eb0d4c44a5806b257&k=89696e8a89fd1b0957a7c558bf30ae9c-04f7-1544596726'
                ]
    const {play_url,expires_in} = playUrl
    if(!play_url){
        return false
    }
    console.log(arr.includes(play_url));

    if(arr.includes(play_url)){
        return false
    }

    const newTime=  new Date().getTime()
    console.log(newTime -expires_in);
    console.log(play_url.split('?')[0]);
    if(!play_url.startsWith('http')){
        return  false
    }
    const resResponse  = await getApiResponse(play_url)
    console.log(resResponse.statusCode,play_url);
    if(resResponse.statusCode!=200){
        console.log('播放地址失效',);
            return  false
        }else{
            console.log('播放地址有效',);
            return true
        }
}
const getApiResponse = url => new Promise((resolve, reject) => request.head(url, (err, response, body) => {
    if (err) {
        reject(err);
    } else {
        resolve(response);
}}))
// 保存/更新 数据库中的 url
async function updatePlayUrl(options,raw_url){
 const play_url =   await getPlayUrlByJiexi(options)
    console.log("play",play_url);
    if (play_url){
        const updateRes = await PlayUrlModel.update({raw_url},{ play_url:play_url})
        if(updateRes.n){
            console.log(updateRes.n);
            return play_url
        }
    }
}
async function savePlayUrl(options,raw_url){
    const play_url =   await getPlayUrlByJiexi(options)
       if (play_url){
           const  PlayUrl = new PlayUrlModel({
               play_url:play_url,
               raw_url:raw_url,
               expires_in :new Date().getTime()
           })
          const playUrl =  await PlayUrl.save()
           return playUrl
       }
   }
   async function getPlayUrlByJiexi(options){
    const {url ,type } = options
     return await  usePuppeteer(url)
   }
// 爬去 接口 获取 播放地址


function format_url (url){
    if(!url.startsWith('27pan')){
        url = sha1(url.split('//')[1].split('?')[0])
    }
    return url
}
module.exports =  {getPlayUrl}

async function usePuppeteer(url){
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
    })
    const page = await browser.newPage()
    let userAgent = 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    await page.setUserAgent(userAgent);
    console.log('子线程');
    console.log('紫禁城 開始工作'); 
   let play_url = await openPage(page,url)
   browser.close()
   return play_url
}
async function openPage(page,url,jiekouIndex = 0) {
    console.log(url);
    let jiekou
    const jiekouArr = [
        'http://api.xcq91.top/?url=',
        'http://api.bbbbbb.me/jx/?url=',
        'http://app.baiyug.cn:2019/vip/index.php?url=',
        'https://2wk.com/vip.php?url=' ]
    if (url.startsWith('27pan')) {
        jiekou = 'https://api2.my230.com/?vid='
    } else {
        jiekou = jiekouArr[jiekouIndex]
        jiekouIndex += 1
    }
    if (!jiekou) {
        return []
    }
    console.log(jiekou);
    
     page.goto(jiekou+url)
    const play_url =  await getApiRequest(page)
    if(!play_url){
       console.log(jiekou+'沒有資源');
       return await openPage(page,url,jiekouIndex)
    }else{
        const resResponse  = await getApiResponse(play_url)
        console.log(resResponse.statusCode,play_url);
        if(resResponse.statusCode== 200||resResponse.statusCode == 405){
            return play_url
        }
        return  await openPage(page,url,jiekouIndex)
    }
}
async function getApiRequest(page) {
    return new Promise((resolve, reject) => {
        page.on('requestfinished', async function (request) {
            const url = request.url().split('?')[0]
            if (request.method() == "POST") {
                console.log( request.url());
                const response = request.response()
                const data = await response.json()
                const host = request.url().split('//')[1].split('/')[0]
                console.log(host);
                let url = data.url
                console.log( data.url);
                if(url){
                    if (!url.startsWith('http')) {
                        url = 'http://' + host + '/' + data.url
                    }
                }
             
                
                if(url&&url.indexOf("?url=") == -1){
                    resolve(url)
                }
            }
        })
    })
}
