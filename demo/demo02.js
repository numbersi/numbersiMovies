const request = require('request')
const getIPAddressPromise = function() {
  return new Promise((resolve, reject) => {
    let options = {
      "url": 'http://ip-api.com/json'
    };

    request.post(options, (err, result, body) => {
      if(body){
          const {query}  =JSON.parse(body)
          console.log(query)
      }
    })
  })
}
;(async function(){
  const ip = await getIPAddressPromise()
  console.log(ip)
})()
