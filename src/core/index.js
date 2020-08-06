import Vue from 'vue';
class Pipe {
    constructor(
        name, 
        layers
    ){
        this.name = name;
        this.layers = layers;
        this.mapping = {};
        this.stopCurrent = false;
        this.currentProcess = null;
    }

    regist(valve){
        const { name } = valve
        if(!this.mapping[name]){
            this.mapping[name] = valve;
            valve.bindPipe(this);
            valve.setLoading(true)
        }else {
            throw `${name} is already registed!`
        }
    }

    unRegist(valve){
        console.log(valve)
        this.mapping[valve.name] = null;
        valve.destroy();
    }

    destroy(){
        Object.values(this.mapping).filter(v => !!v).map((v) => {
            this.unRegist(v)
        })
    }

    initialize(){
        this.loadCurrentLayerResource(this.layers[0][0])
    }
    /**
        请求当前整个层级  
     */
    loadCurrentLayerResource(name){
        const startLayer = this.findStartLayer(name);
        if(startLayer === -1) return Promise.reject();
        const remainLayers = this.layers.slice(startLayer);
        return this.loadResource(Promise.resolve(), remainLayers);
    }
    /**
        请求特定对象及后续层级    
     */
    loadSpecificResource(name){
        const startLayer = this.findStartLayer(name);
        if(startLayer === -1) return Promise.reject();
        const valve = this.mapping[name];
        valve.setLoading(true);
        let pipe = valve.wrapperRequest();
        const remainLayers = this.layers.slice(startLayer + 1);
        return this.loadResource(pipe, remainLayers);
    }
    /**
        请求后续层级    
     */
    loadRemainLayerResource(name){
        console.log('loadRemainLayerResource', name)
        const startLayer = this.findStartLayer(name);
        if(startLayer === -1) return Promise.reject();
        const remainLayers = this.layers.slice(startLayer + 1);
        return this.loadResource(Promise.resolve(), remainLayers);
    }

    findStartLayer(name){
        return this.layers.findIndex(l => l.includes(name));
    }

    findCurrentLayer(layer){
        return this.layers.findIndex(l => l === layer);
    }

    stopCurrentProcess(){
        this.stopCurrent = true;
        return this.currentProcess.then(() => {
            this.stopCurrent = false;
        })
    }

    loadResource(pipe, remainLayers){
        if(remainLayers.length === 0) return pipe
        const {
            mapping
        } = this
        // 设置 loading 态
        remainLayers.forEach(layer => {
            layer.filter(n => mapping[n])
                .forEach(n => {
                    mapping[n].setLoading(true);
                });
        });
        // 设置promise递归
        this.currentProcess = remainLayers.reduce((p, layer) => {
            const promises = () => {
                // 等待停止当前的流程
                if(this.stopCurrent) return Promise.resolve();
                
                return Promise.all(
                    layer.filter(n => mapping[n])
                        .map(n => mapping[n].wrapperRequest()));
            }
            return p.then(promises)
        }, pipe);
        return this.currentProcess;
    }
}

class Valve {
    constructor(
        name, 
        request, 
        watcher,
        condition
    ){
        this.name = name;
        this.request = request;
        this.watcher = watcher;
        this.condition = condition;

        this.loading = Vue.observable({
            status: false,
        })
    }

    wrapperRequest(){
        let result = Promise.resolve();
        if(this.condition()){
            result = this.request();
        }
        return result.finally(() => {
            this.setLoading(false)
        })
    }

    getLoading(){
        return this.loading.status;
    }

    setLoading(status){
        this.loading.status = status
    }

    bindPipe(pipe){
        const loadResource = () => {
            if(this.loading.status) return
            return pipe.stopCurrentProcess()
                .then(() => pipe.loadRemainLayerResource(this.name));
        }
        this.unWatch = this.watcher(loadResource)
        if(!this.unWatch){
            console.error('watcher must return!')
        }
    }

    destroy(){
        this.unWatch();
    }
}

function getLayers(graph){
    return graph.split('>').map(s => 
        s.trim().split(',').map(s => 
        s.trim()));
}

export function createPipe({ name, graph }) { 
    const layers = getLayers(graph);
    return new Pipe(name, layers)
}
export function createValve({ name, request, watcher, condition }) {
    condition = condition || (() => true);
    return new Valve(name, request, watcher, condition)
}

export function registToPipe(pipe, ...valves) {
    valves.forEach(v => {
        pipe.regist(v)
    });
   
}

export function unRegistToPipe(pipe, valve) {
    pipe.unRegist(valve)
}
const globalPipe = {};
export function registPipe(pipe){
    const name = pipe.name || 'root';
    globalPipe[name] = pipe
}

export function unRegistPipe(pipe){
    console.log('unRegistPipe')
    pipe.destroy();
} 

export function getPipe(name){
    name = name || 'root';
    if(globalPipe[name])
        return globalPipe[name];
    return null;
}


