const dwzApi='http://api.t.sina.com.cn/short_url/shorten.json?source=3421048570&url_long='
const request = require('request-promise')
var crypto = require('crypto');

const getDwz = async function(url_long){
    console.log(Object.entries(url_long));
    let url = null
    if(typeof(url_long)==='string'){
         url = dwzApi+url_long
    }else{
         url = dwzApi+url_long.join('&url_long=')
    }
    const short_urls =JSON.parse(await request(url))
    
    if(short_urls.length==1){
        return short_urls[0].url_short
    }
    return  short_urls
}

function md5(str,salt='') {
    var md5 = crypto.createHash('md5');
    return md5.update(str+salt).digest('hex');
}
module.exports={getDwz ,md5}
