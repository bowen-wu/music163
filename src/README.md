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
click ==> uploadAndEdit(status ==> Edit)[eventHub]{editSong} X
click ==> uploadAndEdit[eventHub]{editSong} ==> form 填充内容 显示对应信息 X

订阅 createSong 事件 ==> 局部更新列表 X

###### newSong.js

查询数据库内容 ==> 

click ==> uploadAndEdit(status ==> Upload)[eventHub] ==> editSong(remove active) + uploadArea(remove deactive) X
click ==> songList(li ==> remove active)[self] X


click ==> form 表单的内容是 新上传的 | 编辑的
    - data 空时 ==> 新建页面
    - 编辑的 ==> 已点击保存 ==> data 置空 ==> 新建页面
    - 编辑的{id} ==> 未点击保存 ==> 弹窗 ==> 通知未保存
    - 新上传的{name} ==> 弹窗 ==> 通知未保存
监听事件[eventHub]{changeSong} ==> 将 data 存储到自己的 model 上
监听事件[eventHub]{upload} ==> 将 data 存储到自己的 model 上
监听事件[eventHub]{updateSong} ==> 将 data 初始化(清空)
监听事件[eventHub]{createSong} ==> 将 data 初始化(清空)


###### uploadAndEdit.js

upload status ==> 新建歌曲 + 上传界面 ==> upload-outer remove deactive + editSong remove active[self] X

loading status ==> 拖曳 + 点击上传时 ==> uploading active + uploadArea active + upload active[self] X

editSong status ==>拖曳 + 点击上传成功后 ==> uploading remove active + uploadArea remove active + upload remove active + upload-outer deactive + editSong active[self] X




拖曳 + 点击上传成功后 ==> uploadAndEdit(status ==> Edit)[self] ==> form 填充内容{更改 render 函数} X

拖曳 + 点击上传成功后 ==> uploadAndEdit(status ==> Edit)[self] ==> 监听 ` input ` 事件 ==> 发布 changeSong 事件[eventHub] ==> 内容改变(传 this.model.data) + 内容不变(传 {})

拖曳 + 点击上传成功后 ==> form 点击保存 ==> LeanCloud ==> 存储数据 + 发布事件[eventHub]{createSong} + uploadAndEdit(status ==> upload)[self] 


拖曳 + 点击上传成功后 ==> form 点击保存 ==> newSong[eventHub] ==> 读取数据库 ==> render




songList click form click update + 外链有问题 查看


#### 增

1. 保存到七牛 ==> 问题1： 同名覆盖（最新为主）？




#### 删

#### 改

#### 查


## 相关知识点

1. 传递对象采用深拷贝 
    ```
    JSON.parse(JSON.stringfy(obj))
    ===
    Object.assign({}, {...obj})
    ```

2. forEach 不能跳出循环，可以使用 ` some() | every() ` + ` return true ` 跳出循环

3. ` ... + Object.assign ` 一起使用需要 ` Object.assign(obj1, {...obj2}) `



