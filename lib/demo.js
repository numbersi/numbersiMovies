const request = require('request-promise')

;(async function () {
  const res = await request('http://kan.2345.com/moviecore/server/search/?q=%E4%BD%A0%E5%A5%BD&ctl=think&querytype=suggest')

  console.log(res);
  

})()
