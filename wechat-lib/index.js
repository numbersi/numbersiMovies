const request = require('request-promise')
const base = "https://api.weixin.qq.com/cgi-bin/"
const api = {
  accessToken:base+ "token?grant_type=client_credential"
}

module.exports = class Wechat {

  constructor(opts) {
    this.opts = Object.assign({},opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    console.log(opts);
    
    this.fetchAccessToken()
  }

  async requests(options) {
    console.log(options);
    
    options = Object.assign({},options,{json:true})
    console.log(options);

    try{
      const res = await request(options)
      return res
    }catch(err){
      console.log(err);
    }
  }

  //  获取TOken
  async fetchAccessToken() {
    let data =await this.getAccessToken()
    if (!this.isVaildToken(data)) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)
    return data
  }
  // 更新Token
  async updateAccessToken() {
    const url = api.accessToken + `&appid=${this.appID}&secret=${this.appSecret}`
    console.log("2******************");

    const data = await this.requests({url:url})
    console.log("3******************");

    console.log(data);

    const  now =  new Date().getTime()
    const expiresIn = now + (data.expires_in - 20 )*1000
    data.expires_in = expiresIn
    console.log(data);
    
    return data
  }
  // 判断Token 有效
  isVaildToken(data) {
    if(!data || !data.expires_in){
      return false
    }
    const expiresIN  = data.expires_in
    const now = new Date().getTime()
    if(now >= expiresIN){
      return false
    }
    return true
  }
}
