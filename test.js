const router = require('koa-router')()
var request = require('request-promise');
var cheerio = require('cheerio');
   // url = `https://so.360kan.com/index.php?kw=${kw}&from=`
    url ='https://so.360kan.com/index.php?kw=%E5%A6%82%E6%87%BF%E4%BC%A0&from='

    const html  = await request(url);
    var $ = cheerio.load(html)
    var videoList = [];
    // console.log(html);
            console.log('22')

    $('.js-dianshi').each(function(){
        var title  = $(this)
        console.log('22')
    })
