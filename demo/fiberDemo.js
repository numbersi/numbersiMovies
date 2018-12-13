var Fiber = require('fibers');
var http = require("http");
var f = Fiber(function () {
    var httpFiber = Fiber.current;
    var html = "";
    http.get("http://www.zdziyuan.com/inc/s_api_zuidam3u8.php?ac=list&t=&pg=1&h=&ids=&wd=%E5%BF%AB%E4%B9%90%E5%A4%A7%E6%9C%AC%E8%90%A5", function (res) {
        var dataFiber = Fiber.current;
        res.on("data", function (data) {
            html += data;
        });
        res.on("end", function (data) {
            httpFiber.run();
        });
    });
    
    Fiber.yield();
    console.log(html);
    
})

f.run()
