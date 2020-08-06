# Vue Pipe
[English](https://github.com/wt911122/Vue-Pipe/blob/master/README-en.md)

在开发中，经常出现接口层级依赖的场景，而我们的代码中接口的层级依赖并没有非常直观的体现，接口调用的函数往往呈现出平层的特点。接口的依赖关系更多的体现在页面结构当中，往往上一层及的接口返回的结果，将决定下一层级页面的展示。```Vue Pipe``` 将这种接口调用层级抽象出来，并反应在组件之上。

## v-pipe 

组件```v-pipe``` 代表了一系列的依赖层级，内部可包含任意组件
#### properties
- name: String
选填，代表了当前层级的名称
- graph: String
必填，代表了依赖关系，使用子节点中的```v-pipe```或```v-valve```的名称来标识，举例：```a > b > c,d,e```。```a > b```代表了```b```依赖```a```，```c,d,e```代表了平级关系

## v-valve

组件```v-valve``` 代表了单个请求
#### properties
- name: String
必填，代表了当前请求的名称
- request: Function<() => Promise>
必填，代表了当前请求的方法体
- valve: Any
必填，代表了当前请求完成后修改的目标数据

#### slot
- default
正常情况下的任意组件
- loading
加载时会显示的组件


## 使用技巧 
```v-pipe```可以嵌套使用，这样可以表示出更多的依赖关系，比如:
```javascript
<v-pipe graph="a > b > c">
    ...
    <v-pipe name="b" graph="d > e > f">
        ...
    </v-pipe>
    ...
</v-pipe>

```


## Composition API

有些时候可能使用外层包裹了DIV的v-pipe和v-valve会破坏原有的组件库结构，因此在新版本中，提供了一套Composition API。

示例：
```javascript
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
        }
    },
    setupPipe(){
        // 管道初始化方法，需要返回一个Pipe对象

        // 创建 Pipe 传入name 和依赖图
        const pipe = createPipe({ 
            name: 'root',
            graph: 'levelA > levelB > folder'
        });

        // 创建 Valve，传入name，request，和监听的方法，以及加载条件 condition
        // loadResource 是回调方法，用于触发调用请求
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
            condition: () => this.levelA === 'b', // 请求加载的条件
            watcher: (loadResource) => {
                return this.$watch(() => this.folder, () => {
                    loadResource();
                })
            }
        })
        // 将 Valve 手动注册到 pipe 上 
        registToPipe(pipe, valveA, valveB);
        return pipe;
    },
    computed: {
        // 两种关联loading态到computed属性的方式
        ...mapPipeLoading({
            levelALoading: mapping => mapping.levelA.getLoading()
        }),
        ...mapPipeLoading([
            'levelB' // 默认生成 lavelBLoading 
        ]),
    },
    methods: {
        loadLevelA(){
            ...
        },
        loadLevelB(){
            ...
        },
        loadFolders(){
            ...
        }
    }
}
```


具体的栗子请戳 https://github.com/wt911122/Vue-Pipe
