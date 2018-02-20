{
    let view = {
        el: '#mask',
        template: `
        <div id="dialog" class="dialog">
            <header>
                <h2>警告</h2>
                <div id="close" class="close">
                    <svg class="icon">
                        <use xlink:href="#icon-close1"></use>
                    </svg>
                </div>
            </header>
            <div id="content" class="content">
                <div class="icon-wrapper">
                    <svg class="icon">
                        <use xlink:href="#icon-warn1"></use>
                    </svg>
                </div>
                <div class="prompt">您尚未保存，是否放弃编辑歌曲</div>
            </div>
            <div id="action" class="action">
                <div id="confirm">确认</div>
                <div id="cancel">取消</div>
            </div>
        </div>`,
        init() {
            this.$el = $(this.el)
        },
        render() {
            $(this.el).html(this.template)
        },
        active() {
            $(this.el).addClass('active')
        },
        deactive() {
            $(this.el).removeClass('active')
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
            this.view.render()
            this.bindEvents()
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('dialog', (data) => {
                this.view.active()
                this.model.data = data
            })
        },
        bindEvents() {
            this.view.$el.on('click', '#close', (e) => {
                this.view.deactive()
            })
            this.view.$el.on('click', '#cancel', (e) => {
                this.view.deactive()
            })
            this.view.$el.on('click', '#confirm', (e) => {
                this.view.deactive()
                window.eventHub.emit('giveUpEdit', this.model.data)
            })
        }
    }
    controller.init(view, model)
}