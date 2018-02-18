{
    let view = {
        el: '#songList',
        template: ``,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            $(this.el).html(this.template)
            let {songs} = data
            songs.map((song) => {
                $(this.el).append($(`<li data-song-id=${song.id}>${song.name}-${song.singer}</li>`))
            })
        },
        create(data) {
            $(this.el).append($(`<li data-song-id=${data.id}>${data.name}-${data.singer}</li>`))
        },
        updata(data) {
            $(this.el).find('.active').text(`${data.name}-${data.singer}`)
        },
        active(li) {
            $(li).addClass('active').siblings('.active').removeClass('active')
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
        },
        create(data) {
            this.data.songs.push(data)
        },
        update(data) {
            this.data.songs.map((song, index, thisArr) => {
                if (song.id === data.id) {
                    Object.assign(thisArr[index], { ...data })
                }
            })
        },
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
                this.view.active(e.currentTarget)
                let editSongId = $(e.currentTarget).attr('data-song-id')
                let data = {}
                this.model.data.songs.some((song) => {
                    if(song.id === editSongId){
                        Object.assign(data, {...song})
                        return true
                    }
                })
                window.eventHub.emit('editSong', data)
            })
        },
        bindEventHub() {
            window.eventHub.on('newSong', data => this.view.deactive())
            window.eventHub.on('uploadNewSong', (newSong) => {
                // 此处存在两种选择，songs 是从数据库中去，还是直接添加
                // 数据库取 ==> init 即可，之后重新渲染
                // push + update 局部更新 ==> 疑问：更改信息时是否有问题
                this.model.create(newSong)
                this.view.create(newSong)
            })
            window.eventHub.on('updateSong', (editSong) => {
                this.model.update(editSong)
                this.view.updata(editSong)
            })
        }
    }
    controller.init(view, model)
}