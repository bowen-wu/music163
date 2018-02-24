{
    let view = {
        el: 'section#search',
        template: ``,
        init() {
            this.$el = $(this.el)
        },
        render(data) {

        },
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
        bindEvents() {

        },
        bindEventHub() {
            window.eventHub.on('changePage', (data) => {
                if(data === 'search'){
                    this.view.active()
                }else{
                    this.view.deactive()
                }
            })
        }
    }
    controller.init(view, model)
}