const {getPlayUrl} = require('./lib-getPlayUrl')
function ss(data){
  
}
// const playUrl =  getPlayUrl('http://app.baiyug.cn:2019/vip/index.php?url=https://www.mgtv.com/b/325963/4733223.html?cxid=90f0zbamf',ss)

var {resolve} = require('path')

;(async function () {
  const util = require('util');
  const execFile = util.promisify(require('child_process').execFile);
  const script = resolve(__dirname,'../crawler/playUrl.js')
  // script= '../crawler/playUrl.js'
  console.log('http://api.bbbbbb.me/jx/v.php?url=http://v.qq.com/x/cover/sxbxm9xaakyynzp.html');
  
  const { stdout } = await execFile('node', [script,'http://api.bbbbbb.me/jx/v.php?url=http://v.qq.com/x/cover/sxbxm9xaakyynzp.html']);
  console.log(stdout);
})()
