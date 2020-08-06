<template>
  <div id="app">
    <div id="nav">
        <!-- <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> -->
    </div>
    <div>
        levelA
        <div v-if="levelALoading">levelA is loadingsss...</div>
        <select v-else v-model="levelA">
            <option v-for="l in levelAs" :key="l" >{{ l }}</option>
        </select>
    </div>
    <div>
        levelB
        <div v-if="levelBLoading">levelB is loading...</div>
        <select v-else v-model="levelB">
            <option v-for="l in levelBs" :key="l" >{{ l }}</option>
        </select>
    </div>
    <div v-if="levelA === 'b'">
        folder
        <div v-if="folderLoading">folder is loading...</div>
        <select v-else v-model="folder">
            <option v-for="l in folders" :key="l" >{{ l }}</option>
        </select>
    </div>
    <div v-if="levelA !== 'b'">
        tag
        <div v-if="tagLoading">tag is loading...</div>
        <select v-else v-model="tag">
            <option v-for="l in tags" :key="l" >{{ l }}</option>
        </select>
    </div>
    <div>
        file
        <div v-if="fileLoading">file is loading...</div>
        <select v-else v-model="file">
            <option v-for="l in files" :key="l" >{{ l }}</option>
        </select>
    </div>
    <div>
        type
        <div v-if="typeLoading">type is loading...</div>
        <select v-else v-model="type">
            <option v-for="l in types" :key="l" >{{ l }}</option>
        </select>
    </div>
    <!-- <router-view :level="levelA"/> -->
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
    setupPipe(){
        const pipe = createPipe({ 
            name: 'root',
            graph: 'levelA > levelB > folder, tag > file, type'
        });
        
        const valveA = createValve({
            name: 'levelA',
            request: this.loadLevelA,
            watcher: (loadResource) => {
                return this.$watch(() => this.levelA, () => {
                    loadResource();
                })
            }
        })
        const valveB = createValve({
            name: 'levelB',
            request: this.loadlevelB,
            watcher: (loadResource) => {
                return this.$watch(() => this.levelB, () => {
                    loadResource();
                })
            }
        })
        const folder = createValve({
            name: 'folder',
            request: this.loadFolders,
            condition: () => this.levelA === 'b',
            watcher: (loadResource) => {
                return this.$watch(() => this.folder, () => {
                    loadResource();
                })
            }
        })
        const tag = createValve({
            name: 'tag',
            request: this.loadTags,
            condition: () => this.levelA !== 'b',
            watcher: (loadResource) => {
                return this.$watch(() => this.tag, () => {
                    loadResource();
                })
            }
        })
        const file = createValve({
            name: 'file',
            request: this.loadFiles,
            watcher: (loadResource) => {
                return this.$watch(() => this.file, () => {
                    loadResource();
                })
            }
        })
        const type = createValve({
            name: 'type',
            request: this.loadTypes,
            watcher: (loadResource) => {
                return this.$watch(() => this.type, () => {
                    loadResource();
                })
            }          
        })         
        registToPipe(pipe, valveA, valveB, folder, file, tag, type);
        return pipe 
    },
    computed: {
        ...mapPipeLoading({
            levelALoading: mapping => mapping.levelA.getLoading()
        }),
        ...mapPipeLoading([
            'levelB', 'folder', 'tag', 'file', 'type'
        ]),
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
