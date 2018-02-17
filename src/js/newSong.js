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
        data: {}
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvents()
        },
        bindEvents() {
            this.view.$el.on('click', () => {
                window.eventHub.emit('newSong', this.model.data)
            })
        }
    }
    controller.init(view, model)
}