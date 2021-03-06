{
    let view = {
        el: '#newSong',
        template: `新建歌曲`,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            $(this.el).html(this.template)
        }
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
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            this.view.$el.on('click', () => {
                this.model.data.name ?
                    window.eventHub.emit('dialog', JSON.parse(JSON.stringify(this.model.data))) :
                    window.eventHub.emit('newSong', JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEventHub() {
            window.eventHub.on('changeSong', (data) => {
                this.model.data = data
                // this.model.init()
            })
            window.eventHub.on('upload', (data) => {
                this.model.data = data
                // this.model.init()
            })
            window.eventHub.on('updateSong', () => {
                this.model.init()
            })
            window.eventHub.on('createSong', () => {
                this.model.init()
            })
        }
    }
    controller.init(view, model)
}