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

###### MVC



###### songList.js
```
{
    let view = {
        el: '',
        template: ``,
        init() {},  // 初始化
        render() {}, // 初始 render
        create() {}, // 创建一条新的数据 li
        update() {}, // 局部更新视图
        active() {}, // 激活，添加 active 类
        deactive() {}, // 移除激活，移除 active 类
    }
    let model = {
        data: {}, 
        init() {}, // 初始化
        create() {}, // 创建歌曲后更新 data
        update() {}, // 编辑歌曲信息后更新 data
    }
    let controller = {
        init() {}, // 初始化 + view 初始化 + 调用绑定事件
        getAllSongs() {}, // 获取所有歌曲，this.model.init + this.view.render
        bindEvents() {}， // 歌曲项 click 事件，active + 获取歌曲项的所有信息 + 发布 editSong eventHub
        bindEventHub() {
            // 订阅 newSong eventHub，view ==> deactive
            // 订阅 createSong eventHub，model + view ==> create()
            // 订阅 update eventHub，model + view ==> update()
        }
    }
}
```

###### newSong.js
```
{
    let view = {
        el: '',
        template: ``,
        init() {},  // 初始化
        render() {}, // 初始 render
    }
    let model = {
        data: {},
        init() {},  // 初始化 data（置空）
    }
    let controller = {
        init() {}, // 初始化 + view 初始化 + view render + 调用绑定事件
        bindEvents() {}, // 监听 click 事件，有歌名发布 dialog[eventHub] + 无歌名 newSong[eventHub]
        bindEventHub() {
            // 订阅 changeSong eventHub ==> 更新 this.model.data
            // 订阅 upload eventHub ==> 更新 this.model.data
            // 订阅 updateSong eventHub ==> init data(置空)
            // 订阅 createSong eventHub ==> init data(置空)
        },
    }
}
```

###### uploadAndEdit.js
```
{
    let view = {
        el: '',
        template: ``,
        init() {},   // 初始化
        render() {}, // 初始 render
        update() {}, // 局部更新视图
        uploadActive() {}, // status === upload
        loadingActive() {}, // status === loading
        editActive() {}, // status === edit
    }
    let model = {
        data: {}, 
        init() {}, // 初始化 data(置空)
        create() {}, // 创建数据 + 保存到数据库 + 更新data
        update() {}, // 更新数据 + 保存到数据库 + 更新data
    }
    let controller = {
        init() {},       // 初始化 + view 初始化 + view render + model init + 调用绑定事件
        bindEvents() {},　// 监听 submit 事件 + 获取用户输入 ==> 根据 ID 判断 ==> model >> update(view update + 发布 updateSong[eventHub]) | create(发布 createSong[eventHub] + model init + view update + view uploadActive)
        bindEventHub() {
            // 订阅 giveUpEdit[eventHub] ==> view uploadActive
            // 订阅 newSong[eventHub] ==> model init + view update + view uploadActive
            // 订阅 editSong[eventHub] ==> view editActive + 更新 model.data + 调用 monitorUserInput 事件(监听用户输入事件)
        }, 
        initQiniu() {
            // 每个文件上传时 ==> view loadingActive
            // 每个文件上传成功后 ==> view editActive + 获取歌名 + 外链(url) + view update + 发布 upload[eventHub]
        }, 
        monitorUserInput(){}, // 监听用户输入事件 ==> 拿到用户输入 ==> 与 model.data 对比 ==> 发布 changeSong[eventHub] ==> 一致(参数 >> {}) + 不一致(参数 >> model.data)
    }
}
```

###### dialog.js
```
{
    let view = {
        el: '',
        template: ``,
        init() {},   // 初始化
        render() {}, // 初始 render
        active() {}, // 激活，添加 active 类
        deactive() {}, // 移除激活，移除 active 类
    }
    let model = {
        data: {},
    }
    let controller = {
        init() {},  // 初始化 + view init + view render + 调用绑定事件
        bindEvents() {
            // click close ==> view deactive
            // click cancel ==> view deactive
            // click confirm ==> view deactive + 发布 giveUpEdit[eventHub]
        },   
        bindEventHub() {}, // 订阅 dialog[eventHub] ==> view active + 更新 render
    }
}
```

#### 套路
```
{
    let view = {
        el: '',
        template: ``,
        init() { // 初始化

        },   
        render(data = {}) { // 初始 render

        }, 
        create(data) { // 创建新的项
            console.log(data)
        }, 
        update(data) { // 局部更新视图

        }, 
        <!-- 切换状态函数 -->
        active() { // 激活，添加 active 类

        },
        deactive() { // 移除激活，移除 active 类

        },
    }
    let model = {
        data: {},
        init() { // 初始化

        }, 
        create(data) { // 创建数据 ==> 更新 data
            console.log(data)

        },
        update(data) { // 编辑数据 ==> 更新 data
            console.log(data)
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.init()
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventhub()
        },
        bindEvents(){

        },
        bindEventHub() {
            window.eventHub.on('', (data) => {
                console.log(data)
            })
        },
    }
    controller.init(view, model)
}
```


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

2. 更新 model.data
    - ` this.model.update() `
    - ` Object.assign(this.model.data, {...data}) `
    - ` this.model.data = data `

3. 拿到数据 data 后
    1. 更新 ` model.data `
    2. ` view ` 相关操作 ==> ` this.view.render(this.model.data) + this.view.create(this.model.data) + this.view.update(this.model.date) `

4. forEach 不能跳出循环，可以使用 ` some() ` + `return true` | every() ` + ` return false ` 跳出循环

5. ` ... + Object.assign ` 一起使用需要 ` Object.assign(obj1, {...obj2}) `



