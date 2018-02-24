{
    let view = {
        el: 'section#hotSongList',
        template: ``,
        init() {},
        render(data) {},
        active(data) {
            $(this.el).addClass('active')
        },
        deactive(data) {
            $(this.el).removeClass('active')
        }
    }
    let model = {
        data: {},
        init() {},
        create() {},
        update() {}
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.init()
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {},
        bindEventHub() {
            window.eventHub.on('changePage', (data) => {
                if(data === 'hotSongList'){
                    this.view.active(this.model.data)
                }else{
                    this.view.deactive(this.model.data)
                }
            })
        }
    }
    controller.init(view, model)
}