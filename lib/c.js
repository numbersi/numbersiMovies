const request  = require('request-promise')
const xmlUtil =require('../lib/util-xml')

async function main(){
  process.on('message',async function(message){
    console.log(message)
    console.log(process.pid)
    const {url ,source} =message
    let data =await getHtml(url,source)
    process.send(data)
    process.exit()
  })
}

async function getHtml(url,source){
  let res
  let data =[]
  let video =[]
  data = await getAndXML(url,source)
  return data
}

async function getAndXML(url,source){
  try{
    let res = await request({url:url,timeout:2000})
    return await xmlUtil.searchXML(res,source)
  }catch(err){
    return null
  }

   
}
main()

// console.log(message);
// let data =  await request.get(message.url)
// process.send({url:message.url,data:data.length})
