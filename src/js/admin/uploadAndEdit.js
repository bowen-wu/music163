{
    let view = {
        el: '#uploadAndEdit',
        template: `
            <div id="upload-outer" class="upload-outer">
                <div id="uploadArea" class="uploadArea">
                    <p>拖曳音乐到此区域上传</p>
                    <p>文件大小不能超过 40MB</p>
                </div>
                <div id="upload" class="upload">
                    <span>选择音乐</span>
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
                            <input name="name" type="text" value="{{name}}" />
                        </label>
                    </div>
                    <div class="row">
                        <label>歌手：
                            <input name="singer" type="text" value="{{singer}}" />
                        </label>
                    </div>
                    <div class="row">
                        <label>外链：
                            <input name="url" type="text" value="{{url}}" />
                        </label>
                    </div>
                    <div class="row">
                        <label>封面：
                            <input name="cover" type="text" value="{{cover}}" />
                        </label>
                    </div>
                    <div class="row">
                        <label class="lyric">歌词：
                            <textarea name="lyric" rows="4" type="text">{{lyric}}</textarea>
                        </label>
                    </div>
                    <div class="row">
                        <button id="submit" type="submit" class="submit">保存</button>
                    </div>
                </form>
            </div>`,
        init() {
            this.$el = $(this.el)
        },
        render(data = {}) { // data = {} 保证了render() 参数为空时 保底
            let needs = 'name singer url cover lyric'.split(' ')
            let html = this.template
            needs.map(string => html = html.replace(`{{${string}}}`, data[string] || ''))
            $(this.el).html(html)
        },
        update(data) {
            let needs = 'name singer url cover lyric'.split(' ')
            needs.map(string => $(this.el).find(`[name=${string}]`).val(data[string] || ''))
        },
        uploadActive() {
            $(this.el).find('#upload-outer').removeClass('deactive')
            $(this.el).find('#editSong').removeClass('active')
        },
        loadingActive() {
            $(this.el).find('#uploadArea').addClass('active')
            $(this.el).find('#upload').addClass('active')
        },
        editActive() {
            $(this.el).find('#upload').removeClass('active')
            $(this.el).find('#uploadArea').removeClass('active')
            $(this.el).find('#upload-outer').addClass('deactive')
            $(this.el).find('#editSong').addClass('active')
        },
    }


    let model = {
        data: {},
        init() {
            this.data = {
                id: '',
                name: '',
                singer: '',
                url: '',
                cover: '',
                lyric: ''
            }
        },
        create(data) {
            let Song = AV.Object.extend('Song')
            let song = new Song()
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            song.set('lyric', data.lyric)
            return song.save().then((newSong) => {
                // 更新 this.data 方案一
                // let {attributes:{name, singer, url}, id} = newSong
                // Object.assign(this.data, {id, name, url, singer})

                // 更新 this.data 方案二
                let { id, attributes } = newSong
                Object.assign(this.data, { id, ...attributes })
            })
        },
        update(data) {
            let song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('url', data.url)
            song.set('singer', data.singer)
            song.set('cover', data.cover)
            song.set('lyric', data.lyric)
            return song.save().then((updateSong) => {
                let { id, attributes } = updateSong
                Object.assign(this.data, { id, ...attributes })
            })
        }
    }



    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.init()
            this.view.render(this.model.data)
            this.initQiniu()
            this.bindEventHub()
            this.bindEvents()
        },
        bindEvents() {
            this.view.$el.on('click', '#submit', (e) => {
                e.preventDefault()
                let needs = 'name singer url cover lyric'.split(' ')
                let data = {}
                needs.map(string => data[string] = this.view.$el.find(`[name=${string}]`).val())
                if (this.model.data.id) {
                    this.model.update(data).then(() => {
                        this.view.update(this.model.data)
                        window.eventHub.emit('updateSong', JSON.parse(JSON.stringify(this.model.data)))
                    })
                } else {
                    this.model.create(data).then(() => {
                        window.eventHub.emit('createSong', JSON.parse(JSON.stringify(this.model.data)))
                        this.model.init()
                        this.view.update(this.model.data)
                        this.view.uploadActive()
                    })
                }
            })
        },
        bindEventHub() {
            window.eventHub.on('giveUpEdit', (data) => {
                this.view.uploadActive()
            })
            window.eventHub.on('newSong', (data) => {
                this.model.init()
                this.view.update(this.model.data)
                this.view.uploadActive()
            })
            window.eventHub.on('editSong', (data) => {
                this.view.editActive()
                this.model.data = data
                this.view.update(this.model.data)
                this.monitorUserInput()
            })
        },
        monitorUserInput() {
            this.view.$el.on('input', '[type=text]', (e) => {
                let userInput = {}
                this.view.$el.find('[type=text]').each((index, item) => {
                    userInput[$(item).attr('name')] = $(item).val()
                })
                let needs = 'name singer url cover lyric'.split(' ')
                needs.every((it) => userInput[it] === this.model.data[it]) ?
                    window.eventHub.emit('changeSong', {}) :
                    window.eventHub.emit('changeSong', JSON.parse(JSON.stringify(this.model.data)))
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
                        window.eventHub.emit('loading', this.model.data)
                        // 每个文件上传时,处理相关的事情
                    },
                    'FileUploaded': (up, file, info) => {
                        this.view.editActive()
                        window.eventHub.emit('loaded', this.model.data)
                        // domain 是 bucket（篮子） 域名
                        let domain = up.getOption('domain')
                        // info.response 服务端返回的json，res 解析后的响应对象
                        let res = JSON.parse(info.response)
                        // sourceLink 上传成功后的文件的Url
                        let sourceLink = 'http://' + domain + '/' + encodeURIComponent(res.key)
                        this.model.data = {
                            name: res.key,
                            url: sourceLink
                        }
                        this.view.update(this.model.data)
                        window.eventHub.emit('upload', JSON.parse(JSON.stringify(this.model.data)))



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