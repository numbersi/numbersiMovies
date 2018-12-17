const request = require('request-promise')
const xmlUtil =require('./util-xml')
const {sources} = require("../config/config")
module.exports= class Collect{
  constructor(option){
    //获取 资源地址
    let {source} = option
    if(!source){
      source = "tv6"
    }      
    this.apiUrl =sources[source]
    this.source=source
  }
  async searchBuWd(wd){
    const pramse ='?wd='
   //根据 wd  构建api
    const url = this.apiUrl+pramse+encodeURIComponent(wd)
    const res = await request(url)
    if(res){
      const data = await xmlUtil.searchXML(res)
      return Object.assign(data,{source:this.source})
    }
    //解析 xml
    return []
  }
  //分析 搜索结果
  // 根据 搜索的 单个id 获取详细资料 获取播放m3u8列表
  async getPlayLinkById(id){
    const pramse ='?ac=videolist&ids='
    // 构建api
    const url = this.apiUrl+pramse+id
    const res = await request(url)
    return xmlUtil.getPlayLinkXml(res)
  }
}
