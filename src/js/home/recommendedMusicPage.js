{
    let view = {
        el: 'section#recommendedMusic',
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
        update() {},
    }
    let controller = {
        init(view, model){
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
                if(data === 'recommendedMusic'){
                    this.view.active(this.model.data)
                }else{
                    this.view.deactive(this.model.data)
                }
            })
        }
    }
    controller.init(view, model)
}