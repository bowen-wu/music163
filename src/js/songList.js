{
    let view = {
        el: '#songList',
        template: `
        <li>xxx</li>
        <li>yyy</li>
        <li>你对齐不</li>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            $(this.el).html(this.template)
        },
        deactive() {
            $(this.el).find('.active').removeClass('active')
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
            this.bindEventHub()
        },
        bindEvents() {
            this.view.$el.on('click', 'li', (e) => {
                $(e.currentTarget).addClass('active')
                    .siblings('.active').removeClass('active')
                window.eventHub.emit('editSong', this.model.data)
            })
        },
        bindEventHub() {
            window.eventHub.on('newSong', (data) => {
                console.log(3)
                this.view.deactive()
            })
        }
    }
    controller.init(view, model)
}