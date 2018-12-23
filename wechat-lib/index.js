const request = require('request-promise')
const { sign } = require('./util')

const base = 'https://api.weixin.qq.com/cgi-bin/'
const mpBase = 'https://mp.weixin.qq.com/cgi-bin/'
const semanticUrl = 'https://api.weixin.qq.com/semantic/search?'
const api = {
  semanticUrl,
  accessToken: base + 'token?grant_type=client_credential',
  temporary: {
    upload: base + 'media/upload?',
    fetch: base + 'media/get?'
  },
  permanent: {
    upload: base + 'material/add_material?',
    uploadNews: base + 'material/add_news?',
    uploadNewsPic: base + 'media/uploadimg?',
    fetch: base + 'material/get_material?',
    del: base + 'material/del_material?',
    update: base + 'material/update_news?',
    count: base + 'material/get_materialcount?',
    batch: base + 'material/batchget_material?'
  },
  tag: {
    create: base + 'tags/create?',
    fetch: base + 'tags/get?',
    update: base + 'tags/update?',
    del: base + 'tags/delete?',
    fetchUsers: base + 'user/tag/get?',
    batchTag: base + 'tags/members/batchtagging?',
    batchUnTag: base + 'tags/members/batchuntagging?',
    getTagList: base + 'tags/getidlist?'
  },
  user: {
    remark: base + 'user/info/updateremark?',
    info: base + 'user/info?',
    batchInfo: base + 'user/info/batchget?',
    fetchUserList: base + 'user/get?',
    getBlackList: base + 'tags/members/getblacklist?',
    batchBlackUsers: base + 'tags/members/batchblacklist?',
    batchUnblackUsers: base + 'tags/members/batchunblacklist?'
  },
  menu: {
    create: base + 'menu/create?',
    get: base + 'menu/get?',
    del: base + 'menu/delete?',
    addCondition: base + 'menu/addconditional?',
    delCondition: base + 'menu/delconditional?',
    getInfo: base + 'get_current_selfmenu_info?'
  },
  qrcode: {
    create: base + 'qrcode/create?',
    show: mpBase + 'showqrcode?'
  },
  shortUrl: {
    create: base + 'shorturl?'
  },
  ticket: {
    get: base + 'ticket/getticket?'
  }
}


module.exports = class Wechat {

  constructor(opts) {
    console.log(opts);
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getTicket = opts.getTicket
    this.saveTicket = opts.saveTicket

    this.fetchAccessToken()
  }

  async request (options) {
    options = Object.assign({}, options, { json: true })

    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  //  获取TOken
  async fetchAccessToken() {
    let data =await this.getAccessToken()
    if (!this.isValidToken(data, 'access_token')) {
      data = await this.updateAccessToken()
      this.saveAccessToken(data)
    }
    console.log('获取有效token',data);
    
    return data
  }
  // 更新Token
  async updateAccessToken() {
    const url = api.accessToken + `&appid=${this.appID}&secret=${this.appSecret}`

    const data = await this.request({url:url})

    console.log(data);

    const  now =  new Date().getTime()
    const expiresIn = now + (data.expires_in - 20 )*1000
    data.expires_in = expiresIn
    console.log(data);
    
    return data
  }
  // 判断Token 有效
  isValidToken (data, name) {
    if (!data || !data[name] || !data.expires_in) {
     console.log('无效');
     
      return false
    }

    const expiresIn = data.expires_in
    const now = (new Date().getTime())

    if (now < expiresIn) {
      console.log('有效');
      return true

    } else {
      console.log('无效');
      return false
    }
  }


  async fetchTicket (token) {
    let data = await this.getTicket()

    if (!this.isValidToken(data, 'ticket')) {
      data = await this.updateTicket(token)
      await this.saveTicket(data)

    }


    return data
  }

  async updateTicket (token) {
    const url = api.ticket.get + '&access_token=' + token + '&type=jsapi'

    let data = await this.request({ url: url })
    console.log(data);
    
    const now = (new Date().getTime())
    const expiresIn = now + (data.expires_in - 20) * 1000

    data.expires_in = expiresIn

    return data
  }

  sign(t,url){
    return sign(t,url)
  }
}
