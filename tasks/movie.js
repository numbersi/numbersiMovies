const cp = require('child_process')
const {resolve} = require('path')
const type  = process.argv[2]

;(async ()=>{
    const script = resolve(__dirname,'../crawler/movie-list')
    const child = cp.fork(script,[type])
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

   var a=  null
   a  =await child.on('message',async (data)=>{
        let result = data.result
        ss(result)

    })

    function  ss(data){
        console.log('****',data);
    }
    
})()
