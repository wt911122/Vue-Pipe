<template>
  <div class="about">
        <v-valve name="levelC" :valve="levelC" :request="loadlevelC">
            <div slot="loading">levelC is loading...</div>
            选择levelC
            <select v-model="levelC">
                <option v-for="l in levels" :key="l" >{{ l }}</option>
            </select>
        </v-valve>
    <h1>This is an about page</h1>
  </div>
</template>
<script>
export default {
    props: {
        level: String,
    },
    data(){
        return {
            levelC: '',
            levels: []
        }
    },
    methods: {
        loadlevelC(){
            return new Promise((resolve, reject) => {
                console.log('request levelC')
                setTimeout(() => {
                    this.levels = ['h', 'i', 'j'].map(p => `${this.level}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        }
    }
}
</script>
