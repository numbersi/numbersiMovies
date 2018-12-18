
const xml2js = require('xml2js')
exports.searchXML = async (data,source)=>{
  const content  = await parseXML(data)
  list_video =content.rss.list[0]
  if(list_video.video){
  console.log(list_video);
  
    video = filtration(list_video,source)
    return {video}
  }
  return {status:false,msg:'没找到'}
}
exports.getPlayLinkXml = async (data)=>{
  const content  = await parseXML(data)
  let video = content.rss.list[0].video[0]
  if(video.pic[0].startsWith('tu.php?tu=')){
    video.pic="http://"+video.pic.join(',').slice('tu.php?tu='.length,)
  }else{
    video.pic= video.pic.join(',').slice['']
  }

  return video
}
// 过滤
filtration = (list_video,source)=>{
  list_video.video =list_video.video.filter(function(video){
    video.source = source
    return  ["福利片",'伦理片'].indexOf(video.type[0])
 })
 return list_video.video
} 


parseXML = xml => {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {trim: true}, (err, content) => {
      if (err) reject(err)
      else resolve(content)
    })
  })
}
