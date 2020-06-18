<template>
  <div class="home">
    <v-valve name="levelB" :valve="levelB" :request="loadlevelB">
        <div slot="loading">levelB is loading...</div>
        选择LevelB
        <select v-model="levelB">
            <option v-for="l in levels" :key="l" >{{ l }}</option>
        </select>
    </v-valve>
    <v-pipe name="levelD" graph="folder > tag > file, type">
        <v-valve name="folder" :valve="folder" :request="loadFolders">
            <div slot="loading">folder is loading...</div>
            选择 folder
            <select v-model="folder">
                <option v-for="l in folders" :key="l" >{{ l }}</option>
            </select>
        </v-valve>
        <v-valve name="tag" :valve="tag" :request="loadTags">
            <div slot="loading">tag is loading...</div>
            选择 tag
            <select v-model="tag">
                <option v-for="l in tags" :key="l" >{{ l }}</option>
            </select>
        </v-valve>
        <v-valve name="file" :valve="file" :request="loadFiles">
            <div slot="loading">file is loading...</div>
            选择 file
            <select v-model="file">
                <option v-for="l in files" :key="l" >{{ l }}</option>
            </select>
        </v-valve>
        <v-valve name="type" :valve="type" :request="loadTypes">
            <div slot="loading">type is loading...</div>
            选择 type
            <select v-model="type">
                <option v-for="l in types" :key="l" >{{ l }}</option>
            </select>
        </v-valve>
    </v-pipe>
    <img alt="Vue logo" src="../assets/logo.png">
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'Home',
    props: {
        level: String,
    },
    components: {
        HelloWorld
    },
    data(){
        return {
            levelB: '',
            levels: [],

            folder: '',
            folders: [],

            tag: '',
            tags: [],

            file: '',
            files: [],

            type: '',
            types: []
        }
    },
    methods: {
        loadlevelB(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request levelB')
                    this.levels = ['d', 'e', 'f'].map(p => `${this.level}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadFolders(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request folders')
                    this.folders = ['o', 'p', 'q'].map(p => `${this.level}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadTags(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request tags')
                    this.tags = ['r', 's', 't'].map(p => `${this.level}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadFiles(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request files')
                    this.files = ['x', 'y', 'z'].map(p => `${this.level}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        },
        loadTypes(){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('request types')
                    this.types = ['u', 'v', 'w'].map(p => `${this.level}-${p}`);
                    resolve()
                }, Math.random() * 1000 + 1000);
            });
        }
    }
}
</script>
