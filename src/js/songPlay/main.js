{
    let view = {
        el: 'div#app',
        template: `
        <div class="logo"></div>
        <div class="wrapper">
            <div id="record" class="record active">
                <div id="pause" class="pause"></div>
            </div>
            <div class="play"></div>
        </div>`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            $(this.el).html(this.template)
        },
        changeStatus(status) {
            if(status === 'play'){
                $(this.el).find('#pause').addClass('active')
                $(this.el).find('#record').removeClass('active')
            }else if(status === 'pause'){
                $(this.el).find('#pause').removeClass('active')
                $(this.el).find('#record').addClass('active')
            }
        },
        active(data) {},
        deactive(data) {}
    }
    let model = {
        data: {
            id: '',
            name: '',
            singer: '',
            url: ''
        },
        init() {

        },
        create() {

        },
        update() {
            let query = new AV.Query('Song')
            return query.get(this.data.id).then(song => Object.assign(this.data, {...song.attributes}))
        }
    }
    let controller = {
        status: 'play',
        init(view, model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.init()
            this.view.render(this.model.data)
            this.getId()
            this.model.update().then(() => {
                this.createAudio()
                this.play()
                this.bindEvents()
            })
            this.bindEventHub()
        },
        createAudio() {
            let audio = document.createElement('audio')
            audio.src = this.model.data.url
            audio.loop = true
            this.view.$el.append(audio)
        },
        play() {
            this.view.$el.find('audio')[0].play()
        },
        pause() {
            this.view.$el.find('audio')[0].pause()
        },
        getId() {
            let searchStr = window.location.search
            startPos = searchStr.indexOf('?')
            if(startPos !== -1){
                searchStr = searchStr.slice(startPos+1)
            }
            let searchArr = searchStr.split('&').filter(it => it) // filter 过滤空字符串
            searchArr.some((item) => {
                if(item.split('=')[0] === 'id'){
                    this.model.data.id = item.split('=')[1]
                    return true
                }
            })
        },
        changeStatus() {
            if(this.status === 'play'){
                this.status = 'pause'
                this.pause()
            }else{
                this.status = 'play'
                this.play()
            }
        },
        bindEvents() {
            this.view.$el.on('click', () => {
                this.view.changeStatus(this.status)
                this.changeStatus()
            })
        },
        bindEventHub() {

        }
    }
    controller.init(view, model)

}