const {getPlayUrl} = require('./demo2')
const playUrl =  getPlayUrl('http://api.bbbbbb.me/jx/?url=http://v.qq.com/x/cover/sxbxm9xaakyynzp.html?ptag=2345.paymovie').then(
  (s)=>{
    console.log(s);
    
  }
)

