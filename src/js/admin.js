{
    let APP_ID = 'hC4CrEP9i1K2UHIwVF1jVu0V-gzGzoHsz'
    let APP_KEY = 'lbtJtAtSuU3hj8xWovhig7Ux'

    // AV.init({
    //     appId: APP_ID,
    //     appKey: APP_KEY
    // })
    // let Playlist = AV.Object.extend('Playlist')
    // let playlist = new Playlist()
    // playlist.save({
    //     name: '歌单名称',
    //     cover: '封面',
    //     creatorId: '创建人 ID',
    //     description: '描述',
    //     songs: ['歌曲1','歌曲2','歌曲3','...'],
    // }).then(function (object) {
    //     alert('LeanCloud Rocks!')
    // })

    //引入Plupload 、qiniu.js后
    var uploader = Qiniu.uploader({
        runtimes: 'html5',    //上传模式,依次退化
        browse_button: 'upload',       //上传选择的点选按钮，**必需**
        uptoken_url: 'http://127.0.0.1:8888/uptoken',    //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        domain: 'http://qiniu-plupload.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
        get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
        max_file_size: '20mb',           //最大文件体积限制
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'uploadArea',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function (up, files) {
                plupload.each(files, function (file) {
                    // 文件添加进队列后,处理相关的事情
                });
            },
            'BeforeUpload': function (up, file) {
                // 每个文件上传前,处理相关的事情
            },
            'UploadProgress': function (up, file) {
                $('#uploading').addClass('active')
                $('#uploadArea').addClass('active')
                // 每个文件上传时,处理相关的事情
            },
            'FileUploaded': function (up, file, info) {
                $('#uploading').removeClass('active')
                $('#uploadArea').removeClass('active')
                // 每个文件上传成功后,处理相关的事情
                // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                console.log("info.response",info.response)  // 服务端返回的json
                let domain = up.getOption('domain')  // domain 有问题？？？？？？？？
                console.log('domain',domain)
                let res = JSON.parse(info.response)  // 对象
                console.log('res',res)
                let sourceLink = domain + encodeURIComponent(res.key) //获取上传成功后的文件的Url
                console.log("sourceLink",sourceLink)
            },
            'Error': function (up, err, errTip) {
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function () {
                //队列文件处理完毕后,处理相关的事情
            },
        }
    });
}