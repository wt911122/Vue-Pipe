<template>
    <div v-if="loadingState">
        <slot name="loading"></slot>
    </div>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script>
import { 
    createPipe,
    createValve,
    registToPipe,
    mapPipeLoading,
} from 'vue-pipe'

export default {
    props: {
        name: String,
        request: Function,
        valve: [String, Number, Object, Array]
    },
    inject: [
        'registToPipe',
        'unRegistToPipe',
    ],
    computed: {
        loadingState(){
            return this._vueValve.loading.status
        }
    },
    created(){
        const valve = this._vueValve = createValve({
            name: this.name,
            request: this.request,
            watcher: (loadResource) => {
                return this.$watch(() => this.valve, () => {
                    loadResource();
                })
            },
        })
        this.registToPipe(valve);
    },
    destroyed(){
        this.unRegistToPipe(this._vueValve);
    }
}
</script>

<style>

</style>