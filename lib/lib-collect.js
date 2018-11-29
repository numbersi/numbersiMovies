const request = require('request-promise')
const xmlUtil =require('./util-xml')
module.exports= class Collect{
  async searchBuWd(wd){
   //获取 资源地址
    const searchApi = 'http://www.zdziyuan.com/inc/api_zuidam3u8.php?wd='
   //根据 wd  构建api
    const url = searchApi+encodeURIComponent(wd)
    console.log(url);
    
    const res = await request(url)
  
    //解析 xml
    const data = await xmlUtil.searchXML(res)
    return data
  }
    //分析 搜索结果

  // 根据 搜索的 单个id 获取详细资料 获取播放m3u8列表
  async getPlayLinkById(id){
    const getPlayLinkApi = 'http://www.zdziyuan.com/inc/api_zuidam3u8.php?ac=videolist&ids='
    // 构建api
    const url = getPlayLinkApi+id
    console.log(url);

    const res = await request(url)
    return xmlUtil.getPlayLinkXml(res)
  }
}
