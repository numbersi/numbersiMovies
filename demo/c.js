const request  = require('request-promise')
const xmlUtil =require('../lib/util-xml')

async function main(){
  const start = new Date()

  process.on('message',async function(message){


    const {url ,source} =message
    let data =await getHtml(url,source)
    
    process.send(data)
    const ms = new Date() - start
    console.log(`ccccccccc ${url}   ${ms}ms`)
    process.exit()
  })
}

async function getHtml(url,source){
  let data =[]
  data = await getAndXML(url,source)
  return data
}

async function getAndXML(url,source){
  try{
    let res = await request({url:url})
    return await xmlUtil.searchXML(res,source)
  }catch(err){
    return null
  }


  
}
main()

// console.log(message);
// let data =  await request.get(message.url)
// process.send({url:message.url,data:data.length})
