;(async function () {
  const start = new Date()

var child = require('child_process');
processItem = child.fork('./p.js');


async function main() {
  return new Promise((resolve,reject)=>{
    processItem.on('message',function(message){
      resolve(message)
    })
  })
}
await main()

const ms = new Date() - start
console.log(`mmmmmmmmm ${ms}ms`)

})()
