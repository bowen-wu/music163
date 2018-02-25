{
    let view = {
        el: 'div#app',
        template: `
        <div id="loading" class="loading">
            <div class="lds-default">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
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
        <div id="bg" class="bg" ></div>
        <div class="logo"></div>
        <div class="wrapper">
            <div class="rotate-wrapper">
                <div id="rotate" class="rotate active">
                    <div id="record" class="record">
                        <img src="./img/disc-ip6.png" alt="record" width=296 height=296/>
                    </div>
                    <div id="recordLight" class="recordLight">
                        <img src="./img/disc_light-ip6.png" alt="recordLight" width=296 height=296/>
                    </div>
                    <div id="cover" class="cover">
                        <img src="#" alt="cover" width=186 height=186 />
                    </div>
                </div>
                <div id="pause" class="pause">
                    <img src="./img/pause.png" alt="pause" width=56 height=56 />
                </div>
            </div>
            <div class="play"></div>
        </div>
        <div id="showLyric" class="showLyric">
            <h1></h1>
            <div id="lyric-wrapper" class="lyric-wrapper">
                <div id="lyric" class="lyric">
                    <p>xxxxxxxx</p>
                    <p class="active">yyyyyyyyy</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
                    <p>zzzzzzzzz</p>
                    <p>rrrrrrrrr</p>
                    <p>ttttttttt</p>
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
            this.$el.html(this.template)
        },
        update(data) {
            console.log(data)
            this.$el.find('div#bg').css({'background-image': `url(${data.cover})`})
            this.$el.find('div#cover > img').attr('src', data.cover).on('load', () => {
                window.eventHub.emit('imgSuccess', true)
            })
            this.$el.find('div#showLyric>h1').text(`${data.name} - ${data.singer}`)
        },
        createAudio(data) {
            let audio = document.createElement('audio')
            audio.src = data.url
            this.$el.append(audio)
            this.$el.find('audio')[0].addEventListener('canplaythrough', () => {
                window.eventHub.emit('canPlay', true)
            })
        },
        changeStatus(currentStatus) {
            if(currentStatus === 'pause'){ // 暂停
                this.$el.find('#pause').addClass('active') // 暂停
                this.$el.find('#rotate').addClass('active') // 暂停
            }else if(currentStatus === 'play'){ // 播放
                this.$el.find('#pause').removeClass('active') // 播放
                this.$el.find('#rotate').removeClass('active') // 播放
            }
        },
        loadingDeactive() {
            this.$el.find('div#loading').addClass('active')
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
        currentStatus: 'pause',
        init(view, model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.init()
            this.view.render(this.model.data)
            this.getId()
            this.update()
            this.bindEventHub()
        },
        update() {
            this.model.update().then(() => {
                this.view.update(this.model.data)
            })
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
            if(this.currentStatus === 'play'){
                this.currentStatus = 'pause'
                this.pause()
            }else if(this.currentStatus === 'pause'){
                this.currentStatus = 'play'
                this.play()
            }
        },
        bindEvents() {
            this.view.$el.on('click', () => {
                this.changeStatus()
                this.view.changeStatus(this.currentStatus)
            })
        },
        bindEventHub() {
            window.eventHub.on('imgSuccess', () => {
                this.view.loadingDeactive()
                this.view.createAudio(this.model.data)
                window.eventHub.on('canPlay', () => {
                    this.changeStatus()
                    this.view.changeStatus(this.currentStatus)
                    this.bindEvents()
                })
            })
        }
    }
    controller.init(view, model)

}