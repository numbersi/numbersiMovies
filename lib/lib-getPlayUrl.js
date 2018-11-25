const {resolve} = require('path')
const mongoose = require('mongoose')
const sha1 = require('sha1');
const request = require('request')
const PlayUrlModel  = require('../app/models/playUrl')
async function getPlayUrl (options){
    const {url} = options
    let raw_url = sha1(url.split('//')[1].split('?')[0])

    let  playUrl  =  await PlayUrlModel.findOne({
        raw_url:raw_url
    })
    if(!playUrl){
        // 
        console.log('保存');
        
        playUrl =   await savePlayUrl(options,raw_url)
    }else{
        console.log('更新')
        const isVaild = await isVaildPlayUrl(playUrl)
        if(!isVaild){
            console.log('开始更新', playUrl.play_url);
            playUrl.play_url =   await updatePlayUrl(options,raw_url)
            console.log('开始结束', playUrl.play_url);

        }
    }

    console.log(playUrl);
    
    return playUrl.play_url?playUrl.play_url:'没有找到'
}
// 从数据库中获取播放地址
// async function getPlayB
//验证 播放地址的有效性
async function isVaildPlayUrl(playUrl){
    console.log('开始验证');
    
    const {play_url} = playUrl

    console.log(play_url);
    if(!play_url){
        return false
    }
    console.log(play_url.split('?')[0]);
    
    if(play_url.split('?')[0].endsWith('.mp4')){
        console.log("MP4资源");
        return true
    }

    const resResponse  = await getApiResponse(play_url)
    if(resResponse.statusCode!=200){
        console.log('播放地址失效');
        return  false
    }else{
        console.log('播放地址有效');
        return true
    }

}
const getApiResponse = url => new Promise((resolve, reject) => request.get(url, (err, response, body) => {
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
// 爬去 接口 获取 播放地址
async function getPlayUrlByJiexi(options){
    const {url ,type } = options
    
    let  jiekou= 'http://api.bbbbbb.me/jx/?url='  
    
    console.log('接口爬去');
    
    const util = require('util');
    const execFile = util.promisify(require('child_process').execFile);
    const script = resolve(__dirname,'../crawler/playUrl.js')
    let  stdout = await execFile('node', [script,jiekou+url]);
    console.log("###############",stdout);
    let play_url = stdout.stdout.replace(/[\r\n]/g,"")
    if(play_url==='notFind'){
        console.log('这个是真的没有');
        jiekou ='http://app.baiyug.cn:2019/vip/index.php?url='
        stdout  = await execFile('node', [script,jiekou+url]);
        if(stdout.stdout.replace(/[\r\n]/g,"")==="notFind"){
            console.log('这个是真的没有2');
            return "没有找到你想看的视频"
        }
    }else{
        // const resResponse  = await getApiResponse(stdout.stdout)
        // if(resResponse.statusCode!=200){
        //     console.log('api.bbbbbb.me 播放地址失效');
        //     console.log('用baiyug ');
        //     jiekou ='http://app.baiyug.cn:2019/vip/index.php?url='
        //     stdout = await execFile('node', [script,jiekou+url]);
        // }
    }

    console.log('play_url',play_url);
    return play_url
}
module.exports =  {getPlayUrl}
