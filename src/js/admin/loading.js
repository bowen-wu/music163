{
    let view = {
        el: '#uploading',
        template: ``,
        init() {
            this.$le = $(this.el)
        },
        active() {
            $(this.el).addClass('active')
        },
        deactive() {
            $(this.el).removeClass('active')
        }
    }
    let model = {
        data: {},
        init() {},
        create() {},
        updata() {}
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('loading', () => {
                this.view.active()
            })
            window.eventHub.on("loaded", () => {
                this.view.deactive()
            })
        }
    }
    controller.init(view, model)
}