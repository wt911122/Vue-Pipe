# 写了很多的多层级接口请求终于受不了了，于是写了Vue Pipe

## -1
作为一个B端产品前端，经常要实现各种各样的表单，其中最为常见的是多层级的表单下拉选择框，下一层选择的选项由上一层选择的结果通过接口调用所决定。

这通常对于一个使用Vue的前端简直太简单了，watch上层的结果，调用下层的接口，一顿操作后搞定~于是最后的代码看起来是这样的：
```javascript
// 省略了很多细节上处理的主干
export default {
    data(){
        return {
            a: '', b: '', c: '',
            alist: [], blist: [],clist: [],
            loadingA: false, loadingB: false, loadingC: false
        }
    }
    watch: {
        a(val){
            this.loadB(val).then(this.loadC)
        },
        b(val){
            this.loadC(val)
        },
    },
    create(){
        this.load();
    },
    methods: {
        load(){
            this.loadA().then(this.loadB).then(this.loadC)
        },  
        loadA(val){
            this.loadingA = true;
            return request('a', val).then(() => {
                this.loadingA = false;
            })
        },
        loadB(val){
            this.loadingB = true;
            return request('b', val).then(() => {
                this.loadingB = false;
            })
        },
        loadC(val){
            this.loadingC = true;
            return request('c', val).then(() => {
                this.loadingC = false;
            })
        },
    }
}
```
基本可以跑了，然后开始慢慢调试细节，这个时候有产品跑过来跟你说我要加一个选项，也需要基于B来调用，那好，就来加一个！

```javascript
// 省略了很多细节上处理的主干
export default {
    data(){
        return {
            ... 
            d: '',
            dlist: [],
            loadingD: false,
        }
    },
    watch: {
        a(val){
            this.loadB(val).then(() => {
                this.loadC()
                this.loadD()
            })
        },
        b(val){
            this.loadC(val)
            this.loadD(val)
        },
    },
    methods: {
        loadD(val){
            this.loadingD = true;
            return request('d', val).then(() => {
                this.loadingD = false;
            })
        },
    }
}

```
虽然写完后感觉像吃了苍蝇，但起码还是能实现需求了。

表单用了一段时间之后，业务又拓宽了，于是产品又来找你增加可选项，这次要增加的是e，a决定e，e和b共同决定c
看着之前写的代码，这回真有点觉得难受了，想一想还是要恰饭的嘛，干！

```javascript
// 省略了很多细节上处理的主干
export default {
    data(){
        return {
            ... 
            e: '',
            elist: [],
            loadingE: false,
        }
    },
    watch: {
        a(val){
            Promise.all([
                this.loadE(val), 
                this.loadB(val)
            ]).then(() => {
                this.loadC()
                this.loadD()
            })
        },
        e(val){
            this.loadC(val)
            this.loadD(val)
        },
        b(val){
            this.loadC(val)
            this.loadD(val)
        },
    },
    methods: {
        loadD(val){
            this.loadingD = true;
            return request('d', val).then(() => {
                this.loadingD = false;
            })
        },
        loadE(val){
            this.loadingE = true;
            return request('e', val).then(() => {
                this.loadingE = false;
            })
        }
    }
}

```
调用接口的增加，导致层级性接口的依赖结构越来越复杂，代码也变得难以维护。

为了保护我的头发，还是抽取下这中间模式化的部分比较好，冲鸭！

# 0
结合以上的场景设计，抽取出来的组件须要满足：
+ 为了增强代码可读性，调用的层级关系必须清晰可见
+ 抽取 watch 部分和加载状态判断部分的逻辑以减少冗余代码
+ 层级关系可以嵌套，单入口但会存在多分支末梢

这很容易想到管道的模式，不管拧开哪个阀门，都会根据依赖关系调用后续的接口
于是我设计了两个组件 ```v-pipe```, ```v-valve```
```html
<v-pipe graph="a > b,e > c,d">
    <v-valve name="a" :valve="levelA" :request="loadLevelA">
        <some-select v-model="levelA" :data="levelAList"></some-select>
    </v-valve>
    <v-valve name="b" :valve="levelB" :request="loadLevelB">
        <some-select v-model="levelB" :data="levelBList"></some-select>
    </v-valve>
    <v-valve name="c" :valve="levelC" :request="loadLevelC">
        <some-select v-model="levelC" :data="levelCList"></some-select>
    </v-valve>
    <v-valve name="d" :valve="levelD" :request="loadLevelD">
        <some-select v-model="levelD" :data="levelDList"></some-select>
    </v-valve>
    <v-pipe name="e" graph="x > y">
        <v-valve name="x" :valve="levelX" :request="loadLevelX">
            <some-select v-model="levelX" :data="levelXList"></some-select>
        </v-valve>
        <v-valve name="y" :valve="levelY" :request="loadLevelY">
            <some-select v-model="levelY" :data="levelYList"></some-select>
        </v-valve>
    </v-pipe>
</v-pipe>
```
pipe代表了一段管道，负责调度阀门方法的调用，管道标明了内置阀门的调用关系，```a > b > c,d```。```a > b```代表了```b```依赖```a```，```c,d```代表了平级关系
valve代表了一个阀门调用，监听内部功能组件对应的v-model，需要传入具体调用方法，并且根据调用方法返回的Promise判断loading态。

有时候 a 还能决定别的别的调用，但并不影响c, d的状态，这个时候就得嵌套 pipe

有了显示声明的依赖图，以及明确的标签层级关系，再也不担心看不懂以前写了什么代码，后续要修改什么接口调用啦！

# Tip
这个库还适用于跨 vue-router 的层级，甚至异步加载的模块，具体栗子可以看 [https://github.com/wt911122/Vue-Pipe](https://github.com/wt911122/Vue-Pipe)

# 1
目前还不支持提前结束接口依赖调用，后续会进一步完善！有兴趣可以一起来开发~为了头发！!!
[https://github.com/wt911122/Vue-Pipe](https://github.com/wt911122/Vue-Pipe)
