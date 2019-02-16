const request = require('request-promise')
var crypto = require('crypto');


;(async function(){
  const ip = await getIPAddressPromise()
console.log(ip.ip);

 
  let appid = 'wxb72422fd69462f07'
  let mch_id ='1481038852'
  let nonce_str ='123'
  let mchkey = 'd5ce7bb965b63a95ca81b21e2a0f1ea6'
  let formData = "<xml>";
  let openid ="oZaLq0EEFIVm7fQTYH6z6awldj0U"
  let total_fee = 100
  let out_trade_no =12313231231231232132
  let trade_type ="JSAPI"
  let body = 'bodytttt'
  let spbill_create_ip =ip.ip
  let notify_url ='https://www.baidu.com'
  let data ={key:mchkey,appid,body,spbill_create_ip,mch_id,notify_url,nonce_str,out_trade_no,total_fee,trade_type,openid,}
  // let string = raw(data)+'&key=' + mchkey
  console.log(raw(data));
  let sign =crypto.createHash('md5').update(raw(data), 'utf8').digest('hex').toUpperCase();
  
  
  
  formData += "<appid>" + appid + "</appid>";  //appid
  formData += "<body>"+body+"</body>";
  formData += "<mch_id>" + mch_id + "</mch_id>";  //商户号
  formData += "<nonce_str>" + nonce_str + "</nonce_str>"; //随机字符串，不长于32位。
  formData += "<notify_url>" + notify_url + "</notify_url>";
  formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>";
  formData += "<total_fee>" + total_fee + "</total_fee>";
  formData += "<trade_type>" + trade_type + "</trade_type>";
  formData += "<sign>" + sign + "</sign>";
  formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
  
  formData += "<openid>" + openid + "</openid>";
  formData += "</xml>";
  
  const a = await request.post({url:'https://api.mch.weixin.qq.com/pay/unifiedorder',body: formData })
  console.log(  a.split("<prepay_id><![CDATA[")[1].split("]]></prepay_id>")[0]);

})()



function raw(argss) {
  const {key,...args} =argss
  var keys = Object.keys(args);
  keys = keys.sort()
  
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });
  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string+'&key=' + key;
}
 function getIPAddressPromise () {
  return new Promise((resolve, reject) => {
    let options = {
      "url": 'http://ip-api.com/json'
    };

    request.post(options, (err, result, body) => {
      if(body){
          const {query}  =JSON.parse(body)
          resolve({ip:query})
      }
    })
  })
}
