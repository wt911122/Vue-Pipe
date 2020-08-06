import { registPipe, unRegistPipe, unRegistToPipe, createPipe, createValve, registToPipe, getPipe } from './index';
import Pipe from '../components/pipe.vue';
import Valve from '../components/valve.vue';
export default {
    install(Vue){
        Vue.component('v-pipe', Pipe);
        Vue.component('v-valve', Valve);
        Vue.mixin({
            created(){
                const setupPipe = this.$options.setupPipe;
                
                if(setupPipe){
                    const pipe = this._vuepipe = setupPipe.call(this);
                    pipe.initialize();
                }
            },
            destroyed(){
               
                const setupPipe = this.$options.setupPipe;
                if(setupPipe){
                    unRegistPipe(this._vuepipe)
                }
            }
        })
    }
}

export {
    getPipe,
    createPipe, 
    createValve, 
    registToPipe,
    unRegistToPipe,
    unRegistPipe
}
const getName = (c) => `${c}Loading`
export function mapPipeLoading(i){
    if(Array.isArray(i)){
        const computed = {};
        i.forEach(n => {
            const loadingName = getName(n);
            computed[loadingName] = function(){
                const valve = this._vuepipe.mapping[n];
                return valve.loading.status
            }
        });
        return computed;
    } 
    if(typeof i === 'object'){
        const computed = {};
        Object.keys(i).forEach(n => {
            const f = i[n];
            computed[n] = function(){
                return f(this._vuepipe.mapping)
            }
        });
        return computed;
    }
    return {}
}