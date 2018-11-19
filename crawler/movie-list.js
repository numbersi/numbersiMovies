const type = 'dianshi' 

const a = process.argv[2]
console.log(a);

const types = ['dianshi','zongyi','dianying']
const url = `https://www.360kan.com/${a}/list.php?rank=rankhot&cat=all&area=all&act=all&year=all&pageno=1`
const puppeteer = require('puppeteer')
;(async ()=>{
    console.log(' 开始 ');
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
    await page.goto(url,{
        waitUntil: 'networkidle2'
    })
    const result =await page.evaluate(()=>{
        let $ = window.$
        var items = $('.list li')
        let links = []
        if(items.length >=1){
            items.each((index,item)=>{
                let it  =$(item)
                let url360 = it.find('.js-tongjic').attr('href')
                let title = it.find('.s1').text()
                let hint = it.find('.hint').text()
                let img = it.find('img').attr('src')
                let point = it.find('.point').text()
                links.push({
                    title:title,
                    url360:url360,
                    img:img,
                    hint:hint,
                    point:point
                })
            })

        }
        return links
    })
    browser.close()
    console.log(result);
    process.send({result})
    process.exit(0)
})()
