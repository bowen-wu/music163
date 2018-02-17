{
    let view = {
        el: '#songList',
        $el: $(this.el),
        template: `
        <li>xxx</li>
        <li>yyy</li>
        `,
        init() {
            this.$el = $(this.el)
        },
        render() {
            console.log('---------------')
            console.log(this.$el)
            
            this.$el.html(this.template)
            console.log(1)
        },
    }
    let model = {
        data: {}
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)

        }
    }
    controller.init(view, model)
}