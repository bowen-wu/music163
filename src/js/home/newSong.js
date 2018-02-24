{
    let view = {
        el: 'div.newSong',
        template:`
            <h2>最新音乐</h2>
            <ul class="songList">
            </ul >`,
        init() {
            this.$el = $(this.el)

        },
        render(data = {}) {
            $(this.el).html(this.template)
            let {songs} = data
            songs.map((song) => {
                console.log($(this.el).find('ul.songList'))
                $(this.el).find('ul.songList').append($(`
                <li>
                    <a href="#">
                        <div class="song">
                            <h3 data-song-id=${ song.id } class="songName">${ song.name }</h3>
                            <span class="songDescription">
                                <div class="icon-wrapper">
                                    <svg class="icon">
                                        <use xlink: href="#icon-sq1"></use>
                                    </svg>
                                </div>
                                <div data-song-url=${ song.url } class="descriptionText">${ song.singer }</div>
                            </span>
                        </div>
                        <div class="play">
                            <svg class="icon">
                                <use xlink: href="#icon-bofang1"></use>
                            </svg>
                        </div>
                    </a>
                </li>`))
            })
        },
        active(data) {

        },
        deactive(data) {

        }
    }
    let model = {
        data: {
            songs: [ ],
        },
        init() {
            var query = new AV.Query('Song')
            return query.find().then((songs) => {
                this.data.songs = songs.map(song => {
                    return {id: song.id, ...song.attributes}
                })
            })
        },
        create() {

        },
        update() {}
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.init()
            this.model.init().then(() => {
                this.view.render(this.model.data)
            })
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {},
        bindEventHub() {}
    }
    controller.init(view, model)
}