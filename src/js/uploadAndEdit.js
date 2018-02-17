{
    let view = {
        el: '#uploadAndEdit',
        template: `
            <div id="uploadArea" class="uploadArea">
                <p>拖曳音乐到此区域上传</p>
                <p>文件大小不能超过 40MB</p>
                <div id="upload" class="upload">选择音乐</div>
                <div id="uploading" class="uploading">
                    <div class="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div id="editSong" class="editSong">
                <header>
                    <h2>编辑歌曲</h2>
                    <svg class="icon" aria-hidden="true">
                        <use xlink: href="#icon-edit01"></use>
                    </svg>
                </header>
                <form>
                    <div class="row">
                        <label>歌名：
                            <input type="text" />
                        </label>
                    </div>
                    <div class="row">
                        <label>歌手：
                            <input type="text" />
                        </label>
                    </div>
                    <div class="row">
                        <label>外链：
                            <input type="text" />
                        </label>
                    </div>
                    <div class="row">
                        <button type="submit" class="submit">保存</button>
                    </div>
                </form>
            </div>`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            $(this.el).html(this.template)
        },
        loadingActive() {
            $(this.el).find('#uploading').addClass('active')
            $(this.el).find('#uploadArea').addClass('active')
            $(this.el).find('#upload').addClass('active')
        },
        editActive() {
            $(this.el).find('#uploading').removeClass('active')
            $(this.el).find('#uploadArea').addClass('deactive').removeClass('active')
            $(this.el).find('#editSong').addClass('active')
        },
        uploadActive() {
            $(this.el).find('#uploadArea').removeClass('deactive')
            $(this.el).find('#editSong').removeClass('active')
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: ''
        },
        updata(data) {
            Object.assign(this.data, data)
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.initQiniu()
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('editSong', (data) => {
                this.view.editActive()
            })
            window.eventHub.on('newSong', (data) => {
                this.view.uploadActive()
            })
        },
        initQiniu() {
            //引入Plupload 、qiniu.js后
            let uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: this.view.$el.find('#upload')[0],       //上传选择的点选按钮，**必需**
                uptoken_url: 'http://127.0.0.1:8888/uptoken',    //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                domain: 'p46s4losm.bkt.clouddn.com',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '20mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: this.view.$el.find('#uploadArea')[0],        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': (up, files) => {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file) => {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': (up, file) => {
                        this.view.loadingActive()

                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': (up, file, info) => {
                        this.view.editActive()
                        // domain 是 bucket（篮子） 域名
                        let domain = up.getOption('domain')
                        // info.response 服务端返回的json，res 解析后的响应对象
                        let res = JSON.parse(info.response)
                        // sourceLink 上传成功后的文件的Url
                        let sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key)
                        
                        // this.model.update({
                        //     name: res.key,
                        //     url: sourceLink
                        // })
                        // this.view.render(this.model.data)

                        console.log("sourceLink", sourceLink)



                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                    },
                    'Error': (up, err, errTip) => {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': () => {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });
        }
    }
    controller.init(view, model)
}