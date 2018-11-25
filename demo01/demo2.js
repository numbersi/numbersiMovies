const puppeteer =  require('puppeteer')
const devices = require('puppeteer/DeviceDescriptors')
const iPhone =devices['Nexus 7']

const sleep = time => new Promise(resolve =>{
    setTimeout(resolve,time)
})


const getPlayUrl= async function(url){
   var playUrl = null
   await  puppeteer.launch()
.then(
    async browser => {
        const page = await browser.newPage()

        let userAgent='Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        await page.setUserAgent(userAgent)
        console.log("kaishi");
        console.log(url);

        await page.goto(
            url
            ,{waitUntil:'networkidle2'}
            );
        const data = await page.$eval('body',()=>{})
        console.log(data);
       const a =  await page.frames()
      
       console.log( a.length);

       if (a.length>1){
        Object.keys(a).forEach(function(key){
            console.log(key);
            
        })
        playUrl = await a[a.length-1].$eval('video',v=> v.src)

       }else{

       }

    }
)

    return playUrl

}

module.exports =  {getPlayUrl}