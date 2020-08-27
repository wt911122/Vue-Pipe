<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <v-pipe :graph="graph">
        <v-valve name="levelA" :valve="levelA" :request="loadLevelA">
            <div slot="loading">loading...</div>
            选择
            <select v-model="levelA">
                <option v-for="l in levels" :key="l" >{{ l }}</option>
            </select>
        </v-valve>
        <router-view :level="levelA"/>
    </v-pipe>
  </div>
</template>
<script>
export default {
    data(){
        return {
            levelA: '',
            levels: [],
            graph: 'levelA > (levelB, levelC, levelD)'
        }
    },
    methods: {
        loadLevelA(){
            return new Promise((resolve, reject) => {
                console.log('request levelA')
                setTimeout(() => {
                    this.levels = ['a', 'b', 'c'];
                    resolve()
                }, Math.random() * 1000 + 1000);
            }) 
        }
    }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
