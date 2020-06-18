<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
let flag = true;
const logger = (...args) => {
    if(flag) console.log.call(null, ...args)
}
export default {
    props: {
        name: String,
        graph: String,
    },
    provide(){
        return {
            registToPipe: this._registToPipe,
            unRegistToPipe: this._unRegistToPipe,
            loadResource: this.loadRemainLayerResource,
            loading: this.loading,
        }
    },
    inject: {
        parentRegistToPipe: {
            from: 'registToPipe',
            default: null
        },
        parentUnRegistToPipe: {
            from: 'unRegistToPipe',
            default: null
        },
        parentLoading: {
            from: 'loading',
            default: {}
        },
    },
    data(){
        return {
            mapping: {},
            loading: {},
            inited: false,
        }
    },
    computed: {
        layers(){
            /**
                > 表示分层
                , 表示同级
            */
            return this.graph.split('>').map(s => 
                s.trim().split(',').map(s => 
                s.trim()));
        },
        loadingState(){
            return !!this.parentLoading[this.name];
        }
    },
    watch: {
        loadingState(val){
            Object.keys(this.loading).forEach(k => this.setLoading(k, val))
        }
    },
    created(){
        logger(this.name, 'created', this.parentRegistToPipe)
        if(this.parentRegistToPipe){
            this.parentRegistToPipe(this.name, () => this.loadCurrentLayerResource(this.layers[0][0]));
        }
        
    },
    mounted(){
        logger(this.name, 'mounted', this.loadingState, this.parentRegistToPipe)
        if(this.parentRegistToPipe){
            if(!this.parentLoading) {
                logger('has parentRegistToPipe no parentLoading')
                this.loadCurrentLayerResource(this.layers[0][0]);
            }
        }
        if(!this.parentRegistToPipe) {
            logger('has parentRegistToPipe no parentLoading')
            this.loadCurrentLayerResource(this.layers[0][0]);
        }
    },
    destroyed(){
        if(this.parentUnRegistToPipe){
             this.parentUnRegistToPipe(this.name);
        }
    },
    methods: {
        getLoading(key){
            return this.loading[key];
        },
        setLoading(key, val){
            logger('loading:' ,key, val)
            this.$set(this.loading, key, val);
        },
        _registToPipe(name, request){
            if(!this.mapping[name]){
                this.mapping[name] = request;
                logger(name, this.loading[name])
                this.setLoading(name, !!this.loading[name] || this.loadingState); // 解决异步加载模块产生的初始loading态失效的问题
                logger('inited', this.inited)
                if(this.inited){
                    this.loadSpecificResource(name)
                }
            }else {
                throw `${name} is already registed!`
            }

        },
        _unRegistToPipe(name){
            this.$delete(this.mapping, name);
            this.$delete(this.loading, name);
        },
        findStartLayer(name){
            return this.layers.findIndex(l => l.includes(name));
        }, 
        wrapperRequest(name, request){    
            const setLoading = this.setLoading;   
            const result = request();
            logger(name, request, result)
            return result.finally(() => {
                logger(name)
                setLoading(name, false);
            }) 
        },
        loadCurrentLayerResource(name){
            const startLayer = this.findStartLayer(name);
            let pipe = Promise.resolve();
            const remainLayers = this.layers.slice(startLayer);
            logger(remainLayers)
            pipe = this.loadResource(pipe, remainLayers);
            pipe.finally(() => {
                this.inited = true;
            });
            return pipe;
        },
        loadSpecificResource(name){
            const startLayer = this.findStartLayer(name);
            this.setLoading(name, true)
            let pipe = this.wrapperRequest(name, this.mapping[name]);
            const remainLayers = this.layers.slice(startLayer + 1);
            logger(remainLayers)
            return this.loadResource(pipe, remainLayers);
        },
        loadRemainLayerResource(name){
            const startLayer = this.findStartLayer(name);
            const remainLayers = this.layers.slice(startLayer + 1);
            logger(remainLayers)
            return this.loadResource(Promise.resolve(), remainLayers);
        },
        loadResource(pipe, remainLayers){
            if(remainLayers.length === 0) return pipe
            const {
                mapping, setLoading
            } = this
            remainLayers.forEach(ls => ls.forEach(l => setLoading(l, true)))
            return remainLayers.reduce((p, layer) => {
                const promises = () => 
                    Promise.all(
                        layer.filter(n => mapping[n])
                            .map(n => this.wrapperRequest(n, mapping[n])));
                return p.then(promises)
            }, pipe)
        }
    }
}
</script>

<style>

</style>