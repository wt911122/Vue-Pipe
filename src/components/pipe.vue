<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import { 
    createPipe,
    registToPipe,
    unRegistToPipe,
    mapPipeLoading,
    unRegistPipe
} from '../core/plugin' 

export default {
    props: {
        name: String,
        graph: String,
    },
    provide(){
        return {
            registToPipe: this._registToPipe,
            unRegistToPipe: this._unRegistToPipe,
            isInParentPipe: this._isInParentPipe
        }
    },
    inject: {
        parentRegistToPipe: {
            from: 'registToPipe',
            default: null
        },
        isInParentPipe: {
            from: 'isInParentPipe',
            default: null
        },
        parentUnRegistToPipe: {
            from: 'unRegistToPipe',
            default: null
        },
    },
    data(){
        return {
            isInParent: false,
        }
    },
    created(){
        const pipe = this._vuepipe = createPipe({
            name: this.name,
            graph: this.graph
        });
        this.isInParent = this.isInParentPipe && this.isInParentPipe(this.name)
        if(this.isInParent){
            this.parentRegistToPipe(pipe)
        }
    },
    mounted(){
        if(!this.isInParent)
            this._vuepipe.initialize();
    },
    destroyed(){
        if(this.isInParent){
            this.parentUnRegistToPipe(this._vuepipe)
        } else {
            unRegistPipe(this._vuepipe)
        }
    },
    methods: {
        _isInParentPipe(name){
            return this._vuepipe.layers.find(l => l.includes(name))
        },
        _registToPipe(valve){
            registToPipe(this._vuepipe, valve);
        },
        _unRegistToPipe(valve){
            unRegistToPipe(this._vuepipe, valve);
        },
    }
}
</script>

<style>

</style>