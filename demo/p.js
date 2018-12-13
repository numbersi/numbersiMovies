var child = require('child_process');
const start = new Date()

const {sources} = require("../config/config")
;(async function(){
let processarr={}
let dataArr =[]
const pramse ='?ac=list&t=&pg=1&h=&ids=&wd='
let wd =encodeURIComponent('快乐大本营')
for(source in sources){
  processItem = child.fork('./c.js');
  processItem.send({
    msg:"父进程->子进程",
    url:sources[source]+pramse+wd,
    source:source
  })
  processarr[source] = processItem
}
for(key in processarr){
  processarr[key].on('message',function(message){

    dataArr.push(message)
    if(dataArr.length ==Object.keys(processarr).length ){
        process.send(JSON.stringify(dataArr))

        const ms = new Date() - start
        console.log(`ppppppppppp   ${ms}ms`)
    }
  })
}
async function main(child_process) {
  return new Promise((resolve,reject)=>{
    child_process.on('message',function(message){
      resolve(message)
    })
  })
}
})()

