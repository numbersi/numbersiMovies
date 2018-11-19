const {getPlayUrl} = require('./demo2')
const playUrl =  getPlayUrl('http://app.baiyug.cn:2019/vip/index.php?url=https://www.mgtv.com/b/325963/4733223.html?cxid=90f0zbamf').then(
  (s)=>{
    console.log(s);
    
  }
)

