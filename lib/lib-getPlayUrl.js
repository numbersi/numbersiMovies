const cp = require('child_process')
const {resolve} = require('path')
// const url  = process.argv[2]
const util  = require('util')
async function getPlayUrl (url){
    console.log(url);
    
    const script = resolve(__dirname,'../crawler/playUrl')
    const child = cp.fork(script,[url])
    let invoked =false
    
    child.on('error',err=>{
        if(invoked) return
        invoked = true
        console.log(err)
    })
    child.on('exit',code => {
        if(invoked) return
        invoked = true
        let err = code ===0 ?null : new Error('exit code'+code)
        console.log((err))
    })


   let a = await  util.promisify(child.on)('message')
    console.log('@@@',a);
    
}
module.exports =  {getPlayUrl}