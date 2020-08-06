<template>
  <div id="app">
    <div id="nav">
        <!-- <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> -->
    </div>
    <v-pipe graph="levelA > levelB > folder, tag > file, type">
        <div>
            levelA
            <v-valve name="levelA" :request="loadLevelA" :valve="levelA">
                <div slot="loading">levelA is loadingsss...</div>
                <select v-model="levelA">
                    <option v-for="l in levelAs" :key="l" >{{ l }}</option>
                </select>
            </v-valve>
        </div>
        <div>
            levelB
            <v-valve name="levelB" :request="loadlevelB" :valve="levelB">
                <div slot="loading">levelB is loadingsss...</div>
                <select v-model="levelB">
                    <option v-for="l in levelBs" :key="l" >{{ l }}</option>
                </select>
            </v-valve>
        </div>
        <div v-if="levelA === 'b'">
            folder
            <v-valve name="folder" :request="loadFolders" :valve="folder">
                <div slot="loading">folder is loadingsss...</div>
                <select v-model="folder">
                    <option v-for="l in folders" :key="l" >{{ l }}</option>
                </select>
            </v-valve>
        </div>
        <div v-if="levelA !== 'b'">
            tag
            <v-valve name="tag" :request="loadTags" :valve="tag">
                <div slot="loading">tag is loadingsss...</div>
                <select v-model="tag">
                    <option v-for="l in tags" :key="l" >{{ l }}</option>
                </select>
            </v-valve>
        </div>
        <div>
            file
            <v-valve name="file" :request="loadFiles" :valve="file">
                <div slot="loading">file is loadingsss...</div>
                <select v-model="file">
                    <option v-for="l in files" :key="l" >{{ l }}</option>
                </select>
            </v-valve>
        </div>
        <div>
            type
            <v-valve name="type" :request="loadTypes" :valve="type">
                <div slot="loading">type is loadingsss...</div>
                <select v-model="type">
                    <option v-for="l in types" :key="l" >{{ l }}</option>
                </select>
            </v-valve>
        </div>
    </v-pipe>
    <!-- <router-view :level="levelA"/> -->
  </div>
</template>
<script>
export default {
    data(){
        return {
            levelA: '',
            levelAs: [],

            levelB: '',
            levelBs: [],

            folder: '',
            folders: [],

            tag: '',
            tags: [],

            file: '',
            files: [],

            type: '',
            types: [],
        }
    },
    methods: {
        loadLevelA(){
            return new Promise((resolve, reject) => {
                console.log('request levelA')
                setTimeout(() => {
                    this.levelAs = ['a', 'b', 'c'];
                    this.levelA = this.levelAs[0]
                    resolve()
                }, Math.random() * 1000 + 1000);
            }) 
        },
        loadlevelB(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request levelB')
                    this.levelBs = ['d', 'e', 'f'].map(p => `${this.levelA}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadFolders(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request folders')
                    this.folders = ['o', 'p', 'q'].map(p => `${this.levelA}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadTags(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request tags')
                    this.tags = ['r', 's', 't'].map(p => `${this.levelA}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadFiles(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request files')
                    this.files = ['x', 'y', 'z'].map(p => `${this.levelA}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadTypes(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request types')
                    this.types = ['u', 'v', 'w'].map(p => `${this.levelA}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
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
