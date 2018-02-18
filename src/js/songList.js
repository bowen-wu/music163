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
            let {songs} = data
            songs.map((song) => {
                $(this.el).append($(`<li>${song.name}</li>`))
            })
        },
        deactive() {
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model = {
        data: {
            songs: [], // [{},{},{},{}]
        },
        init() {
            let query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    return {id: song.id, ...song.attributes}
                })
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
        getAllSongs() {
            this.model.init().then(() => {
                this.view.render(this.model.data)
            })
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
            window.eventHub.on('uploadNewSong', (newSong) => {
                console.log(newSong)
            })
        }
    }
    controller.init(view, model)
}