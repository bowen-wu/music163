## music163

## 需求分析

#### 用例图

![用例图](http://upload-images.jianshu.io/upload_images/9617841-df77aaf849b7e8ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 系统框架图

![系统结构图](http://upload-images.jianshu.io/upload_images/9617841-d37e8f2a64b5b6bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 七牛依赖
```
moxie.js + plupload.js + qiniu.js
```

## 使用本地 server.js 生成 uptoken
官方代码
```
var accessKey = 'your access key'
var secretKey = 'your secret key'
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

var options = {
  scope: bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken=putPolicy.uploadToken(mac);
```
其中：
- ` scope ` ==> 本项目七牛篮子的名称
- ` uploadToken ` ==> uptoken 值

**注意：**不要将 accessKey + secretKey 上传到 github，使用读取文件获取 AK + SK
```
// uptokenConfig.json 是保存 AK + SK 的文件
let content = JSON.parse(fs.readFileSync('./uptokenConfig.json')) 
let {accessKey, secretKey} = content
```

#### 使用说明
如要生成 uptoken 需要打开 server，执行命令 ` node server.js ` 即可