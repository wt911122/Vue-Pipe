<template>
    <div v-if="loadingState">
        <slot name="loading"></slot>
    </div>
    <div v-else>
        <slot></slot>
    </div>
</template>

<script>
let flag = false;
const logger = (...args) => {
    if(flag) console.log.call(null, ...args)
}
export default {
    props: {
        name: String,
        request: Function,
        valve: [String, Number, Object, Array]
    },
    inject: [
        'registToPipe',
        'unRegistToPipe',
        'loadResource',
        'loading',
    ],
    computed: {
        loadingState(){
            logger(this.loading, this.name, this.loading[this.name])
            return this.loading[this.name];
        }
    },
    created(){
        logger(this.name, 'created')
        this.registToPipe(this.name, this.request);
    },
    mounted(){
        this.$watch(() => this.valve, () => {
            this.loadResource(this.name);
        })
    },
    destroyed(){
        this.unRegistToPipe(this.name);
    }
}
</script>

<style>

</style>