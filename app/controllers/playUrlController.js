const {resolve} = require('path')
const mongoose = require('mongoose')
const sha1 = require('sha1');
const util  = require('util')
const PlayUrl  = mongoose.model('PlayUrl')
async function getPlayUrl (options){
    const {url} = options
    let raw_url = sha1(url.split('//')[1].split('?')[0])

    var paly_url  =  await PlayUrlModel.findOne({
        raw_url:raw_url
    })
    if(!isVaildPlayUrl(paly_url)){
        await updatePlayUrl(options)
    }
}
// 从数据库中获取播放地址
// async function getPlayB
//验证 播放地址的有效性
function isVaildPlayUrl(paly_url){

}
// 保存/更新 数据库中的 url
async function updatePlayUrl(options){
 const play_url =   await getPlayUrlByJiexi(options)
    const  PlayUrlModel = new PlayUrl
}
// 爬去 接口 获取 播放地址
async function getPlayUrlByJiexi(options){
    const {url ,type } = options
    
    let jiekou ='http://app.baiyug.cn:2019/vip/index.php?url='
    if(type){
        jiekou= 'http://api.bbbbbb.me/jx/?url='  
    }
    const util = require('util');
    const execFile = util.promisify(require('child_process').execFile);
    const script = resolve(__dirname,'../crawler/playUrl.js')
    const { stdout } = await execFile('node', [script,jiekou+url]);
    console.log(stdout);
    return stdout
}
module.exports =  {getPlayUrl}
