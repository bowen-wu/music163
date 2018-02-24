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
            this.importEcommendedListModule()
            this.importNewSongModule()
            this.bindEvents()
            this.bindEventHub()
        },
        importEcommendedListModule() {
            let script = document.createElement('script')
            script.src = './js/home/recommendedList.js'
            document.body.append(script)
        },
        importNewSongModule() {
            let script = document.createElement('script')
            script.src= './js/home/newSong.js'
            document.body.append(script)
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