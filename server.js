var http = require('http')
var fs = require('fs')
var url = require('url')
var qiniu = require('qiniu')
var port = 8888


var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url 
  var queryString = ''
  if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method



  console.log('含查询字符串的路径\n' + pathWithQuery)

  if(path === '/uptoken'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*') // CORS 跨域


    // 获取 uptoken 并使用 CORS 可以使其可以跨域
    let content = JSON.parse(fs.readFileSync('./uptokenConfig.json'))
    let {accessKey, secretKey} = content
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let options = {
      scope: "music163",
    };
    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(mac)
    response.write(`{"uptoken": "${uploadToken}"}`)




    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.write('呜呜呜')
    response.end()
  }


})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)