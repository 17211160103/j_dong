
const exec = require('child_process').execSync
const fs = require('fs')
const rp = require('request-promise')
const download = require('download')

// 京东cookie 1
const cookie = '__jdu=17115525764901120762364; o2State={%22webp%22:true%2C%22avif%22:true}; shshshfpa=6b5c02d3-b704-b6a6-8ced-971211e8c92a-1711552595; shshshfpx=6b5c02d3-b704-b6a6-8ced-971211e8c92a-1711552595; pinId=Soz6rZa2ygDRd6ECYzG_97V9-x-f3wj7; __jdv=181111935%7Cgithub.com%7C-%7Creferral%7C-%7C1737820368753; areaId=15; ipLoc-djd=15-1280-0-0; PCSYCityID=CN_330000_331100_0; TrackID=1KcguJ9SKYqWeoF6xHjDmRdvqOJFhnmHJIvzva9z8nMklysJPDlMPfYYTfGB-yk9vo7_ssv10JdnCbGU_Fg3xUlxKhdWfB2ytosEfP5yBWJOraV4If2RgiGY6vjodvgii; thor=365568A33BED8B3CF4695F882886CF6BFA97F732CE605CB80CAA4D1D2B900812FC51D6A665BD424ECDC7DD63119211753FC2B744DCFCFF149CE9F0C30E576B471E40F46F84A026C5344E9F836F32A56EBD18A84ED4F4683D90F8B60B1A6E7025E25C5417C5E998CDFBEC5423B39920FD47B6A7C8D7E22FC82D31DB1C342C813CF3A63DF8F1B5E5E674488F6E15A68755482605D1A8E617F6FFBDE153F07F8C18; light_key=AASBKE7rOxgWQziEhC_QY6ya_jKIILint6sMiwRpE_2505SVPTSqd7pOtsg5-ndTHORvslhP; pin=jd_6a1af830a79e8; unick=%E6%89%BF%E8%AF%BAmix; ceshi3.com=201; _tp=E6ftrVGwCA7pvuj1QCTzPSZpviEANxiz6hJ%2FbzI6u%2BM%3D; _pst=jd_6a1af830a79e8; umc_count=1; UseCorpPin=jd_6a1af830a79e8; shshshfpb=BApXSls1bqPFAqqzDRUNYEj4k_mWqLnjwBlMUIrps9xJ1Mu8DGYC2; __jda=166561581.17115525764901120762364.1711552576.1737820368.1738040804.8; __jdc=166561581; __jdb=166561581.8.17115525764901120762364|8.1738040804; 3AB9D23F7A4B3CSS=jdd03Y7MAZTMSZCGE77DBHKOZ5YI6DI4ZQJSMPRQ5BQ4ELAFIU5AYTNKIWJCOJDULKTECA6FSD4KME5DCS5XEDGKYZSFLQIAAAAMUVNKKJUIAAAAACUP2SO4HNQZKSEX; source=PC; platform=pc; 3AB9D23F7A4B3C9B=Y7MAZTMSZCGE77DBHKOZ5YI6DI4ZQJSMPRQ5BQ4ELAFIU5AYTNKIWJCOJDULKTECA6FSD4KME5DCS5XEDGKYZSFLQI; flash=3_8WDS6nBYw10MiTz10mFa9V2Dz-cOwhDPGkYeccq1dmgMxQk_nXVCamjPxLbw6gPuWXhJrl_3OzwEL9X8NsD5doAmkPf97Mjzbno7qhJmF765egEUxwJl7zobdm2zWCoGCrgAtEvbCLbwY8qDgyCNNF-nAqZvrFr8ukbxSrSkK_ADxKDnCqzWSq**; '
// Server酱SCKEY
const push_key = 'SCT243469TBuuCr1hnwBrU9yRE1KfNvFJw'

// 京东脚本文件
const js_url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js'
// 下载脚本路劲
const js_path = './JD_DailyBonus.js'
// 脚本执行输出路劲
const result_path = './result.txt'
// 错误信息输出路劲
const error_path = './error.txt'

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)));
    }
  }
  return fmt;
};

function setupCookie() {
  var js_content = fs.readFileSync(js_path, 'utf8')
  js_content = js_content.replace(/var Key = ''/, `var Key = '${cookie}'`)
  fs.writeFileSync(js_path, js_content, 'utf8')
}

function sendNotificationIfNeed() {

  if (!push_key) {
    console.log('执行任务结束!'); return;
  }

  if (!fs.existsSync(result_path)) {
    console.log('没有执行结果，任务中断!'); return;
  }

  let text = "京东签到_" + new Date().Format('yyyy.MM.dd');
  let desp = fs.readFileSync(result_path, "utf8")

  // 去除末尾的换行
  let SCKEY = push_key.replace(/[\r\n]/g,"")

  const options ={
    uri:  `https://sc.ftqq.com/${SCKEY}.send`,
    form: { text, desp },
    json: true,
    method: 'POST'
  }

  rp.post(options).then(res=>{
    const code = res['errno'];
    if (code == 0) {
      console.log("通知发送成功，任务结束！")
    }
    else {
      console.log(res);
      console.log("通知发送失败，任务中断！")
      fs.writeFileSync(error_path, JSON.stringify(res), 'utf8')
    }
  }).catch((err)=>{
    console.log("通知发送失败，任务中断！")
    fs.writeFileSync(error_path, err, 'utf8')
  })
}

function main() {

  if (!cookie) {
    console.log('请配置京东cookie!'); return;
  }

  // 1、下载脚本
  download(js_url, './').then(res=>{
    // 2、替换cookie
    setupCookie()
    // 3、执行脚本
    exec(`node '${js_path}' >> '${result_path}'`);
    // 4、发送推送
    sendNotificationIfNeed() 
  }).catch((err)=>{
    console.log('脚本文件下载失败，任务中断！');
    fs.writeFileSync(error_path, err, 'utf8')
  })

}

main()
