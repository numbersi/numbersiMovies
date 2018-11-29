
const xml2js = require('xml2js')
exports.searchXML = async (data)=>{

  const content  = await parseXML(data)

  list_video =content.rss.list[0].video
  if(list_video){
    return {status:true,list_video}
  }
  return {status:false,msg:'没找到'}
}
exports.getPlayLinkXml = async (data)=>{
  const content  = await parseXML(data)
  return content.rss.list[0].video[0]
}

parseXML = xml => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}
