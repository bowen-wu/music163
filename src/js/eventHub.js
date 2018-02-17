{
    window.eventHub = {
        events: {},
        emit(eventName, data) {  // 发布
            for(let key in this.events){
                if(key === eventName){
                    this.events[key].map(fn => fn.call(null, data))
                }
            }
        },
        on(eventName, cb) {  // 订阅
            if(!this.events[eventName]){
                this.events[eventName] =[]
            }
            this.events[eventName].push(cb)
        }
    }
}