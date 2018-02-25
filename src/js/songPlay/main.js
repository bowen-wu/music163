{
    let view = {
        el: 'div#app',
        template: `
        <div class="logo"></div>
        <div class="wrapper">
            <div id="rotate" class="rotate active">
                <div id="record" class="record">
                    <img src="./img/disc-ip6.png" alt="record" width=296 height=296/>
                </div>
                <div id="recordLight" class="recordLight">
                    <img src="./img/disc_light-ip6.png" alt="recordLight" width=296 height=296/>
                </div>
                <div id="cover" class="cover">
                    <img src="./img/female.jpg" alt="cover" width=186 height=186 />
                </div>
                <div id="pause" class="pause">
                    <img src="./img/pause.png" alt="pause" width=56 height=56 />
                </div>
            </div>
            <div class="play">
                
            </div>
        </div>
        <div id="showLyric" class="showLyric">
            <h1>可以了</h1>
            <div id="lyric-wrapper" class="lyric-wrapper">
                <div id="lyric" class="lyric">
                    xxxxxxxx
                    yyyyyyyyy
                    zzzzzzzzz
                    rrrrrrrrr
                    ttttttttt
                </div>
            </div>
        </div>
        <div id="action" class="action">
            <div><a href="#">打开</a></div>
            <div><a href="#">下载</a></div>
        </div>`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            $(this.el).html(this.template)
        },
        update(data) {

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
            url: '',
            cover: '',
            lyric: ''
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
            console.log(JSON.stringify(this.model.data))
            this.model.update().then(() => {
                console.log(JSON.stringify(this.model.data))
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