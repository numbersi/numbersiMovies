var request = require('request');
const url = 'http://v.kandian.qq.com/1006_1d5c491a0759482ea8b5bbfcacfea046.f20.mp4'

request.head(url,(e,r,b)=>{
    console.log(r.statusCode)
})
