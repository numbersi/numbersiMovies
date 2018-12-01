
const xml2js = require('xml2js')
exports.searchXML = async (data)=>{
  const content  = await parseXML(data)
  list_video =content.rss.list[0]
  if(list_video){
    return {status:true,list_video}
  }
  return {status:false,msg:'没找到'}
}
exports.getPlayLinkXml = async (data)=>{
  const content  = await parseXML(data)
  let video = content.rss.list[0].video[0]
  console.log(video.pic);
  
  if(video.pic[0].startsWith('tu.php?tu=')){
    video.pic="http://v10.tv6.com/"+video.pic.join(',')
  }else{
    video.pic= video.pic.join(',')
  }
  console.log(video.pic);

  return video
}

parseXML = xml => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}
