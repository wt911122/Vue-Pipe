import Pipe from './src/pipe.vue';
import Valve from './src/valve.vue';
export default {
    install(Vue){
        Vue.component('v-pipe', Pipe);
        Vue.component('v-valve', Valve);
    }
}