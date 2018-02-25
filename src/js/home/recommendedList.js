{
    let view = {
        el: 'div#recommendedList',
        template: ``,
        init() {
            this.$el = $(this.el)
        },
        render(data) {

        },
        active(data) {

        },
        deactive(data) {

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
        bindEventHub() {}
    }
    controller.init(view, model)
}