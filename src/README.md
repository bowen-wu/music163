## 概述

#### 需求分析

###### 用例图

![用例图](http://upload-images.jianshu.io/upload_images/9617841-df77aaf849b7e8ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 系统框架图

![系统结构图](http://upload-images.jianshu.io/upload_images/9617841-d37e8f2a64b5b6bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 七牛依赖
```
moxie.js + plupload.js + qiniu.js
```

#### 使用本地 server.js 生成 uptoken
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

###### 使用说明
如要生成 uptoken 需要打开 server，执行命令 ` node server.js ` 即可

## admin 页面

#### CSS

歌曲 ==> li ==> active


上传区 ==> uploadArea ==> active ==> 正在上传歌曲
上传区 ==> upload ==> active ==> 正在上传歌曲
上传区 ==> uploadArea ==> deactive ==> 歌曲上传成功，编辑歌曲

选择音乐 ==> upload ==> active ==> 正在上传歌曲

正在上传歌曲 ==> uploading ==> active ==> 正在上传歌曲(正常情况是隐藏)

编辑歌曲 ==> editSong ==> active ==> 歌曲上传成功，编辑歌曲

#### JS

歌曲列表（音乐库） ==> songList.js ==> ul

新建歌曲 ==> newSong.js ==> newSong

上传歌曲 + 编辑歌曲 ==> uploadArea + editSong(uploadAndEdit.js) ==> main

###### songList.js

click ==> active[self] X
click ==> uploadAndEdit(status ==> Edit)[eventHub] X
click ==> uploadAndEdit ==> form 填充内容 

###### newSong.js

click ==> uploadAndEdit(status ==> Upload)[eventHub] ==> editSong(remove active) + uploadArea(remove deactive) X
click ==> songList(li ==> remove active) X

###### uploadAndEdit.js

loading status ==> 拖曳 + 点击上传时 ==> uploading active + uploadArea active + upload active X

editSong status ==>拖曳 + 点击上传成功后 ==> uploading remove active + uploadArea remove active + upload remove active + upload-outer deactive + editSong active X

upload status ==> 新建歌曲 + 上传界面 ==> upload-outer remove deactive + editSong remove active X

拖曳 + 点击上传成功后 ==> uploadAndEdit(status ==> Edit)[self] X
拖曳 + 点击上传成功后 ==> uploadAndEdit(status ==> Edit) ==> form 填充内容 X
拖曳 + 点击上传成功后 ==> form 点击保存 ==> LeanCloud ==> 存储数据 




