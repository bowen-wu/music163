{
    let view = {
        el: '#topNav',
        template: `
        <ul>
            <li data-page="recommendedMusic" class="active">推荐音乐</li>
            <li data-page="hotSongList">热歌榜</li>
            <li data-page="search">搜索</li>
        </ul>`,
        init() {
            this.$el = $(this.el)
        },
        render(data = {}) {
            $(this.el).html(this.template)
        },
        active(li) {
            $(li).addClass('active').siblings('.active').removeClass('active')
        },
        deactive() {

        }
    }
    let model = {
        data: {},
        init() {},
        create() {},
        update() {}        
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
            this.view.$el.on('click', 'li', (e) => {
                this.view.active(e.currentTarget)
                window.eventHub.emit('changePage', $(e.currentTarget).attr('data-page'))
            })
        },
        bindEventHub() {

        }
    }
    controller.init(view, model) 
}