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
        }
    },
    created(){
        this._vuepipe = createPipe({
            name: this.name,
            graph: this.graph
        });
    },
    mounted(){
        this._vuepipe.initialize();
    },
    destroyed(){
        unRegistPipe(this._vuepipe)
    },
    methods: {
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