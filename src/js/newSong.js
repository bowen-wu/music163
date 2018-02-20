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
                name: '',
                singer: '',
                url: '',
                id: '',
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
                console.log("this.model.data")
                console.log(this.model.data)
                if(this.model.data.name){ // 弹窗
                    window.eventHub.emit('dialog', this.model.data)
                }else{  // 新建歌曲
                    window.eventHub.emit('newSong', this.model.data)
                }   
            })
        },
        bindEventHub() {
            window.eventHub.on('editSong', (data) => {
                this.model.data = data
            })
            window.eventHub.on('upload', (data) => {
                this.model.data = data
            })
            window.eventHub.on('updateSong', () => {
                this.model.data.init()
            })
            window.eventHub.on('createSong', () => {
                this.model.init()
            })
        }
    }
    controller.init(view, model)
}