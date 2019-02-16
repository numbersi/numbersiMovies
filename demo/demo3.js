const url ='http://sh-ctfs.ftn.qq.com/东宫EP08.mp4?ver=6010&rkey=dfc7bd52657c507ba0cef83568adb47b02f4b6d0b0fcafa86c81773ca280e66c9eb8dae5eb43c325fb1cb2d035b3e254c861d80f0b0c2bdcb925876cacebf0b8'
const request = require('request')

console.log(encodeURI(url))
request.head(encodeURI(url),(err, response, body) => {
    console.log(err)
    console.log(response.statusCode)
})