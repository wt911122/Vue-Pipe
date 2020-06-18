# Vue Pipe

In the development, there are often scenes of interface level dependence, and the level dependence of the interface in our code is not very intuitive, and the functions called by the interface often show flat characteristics. The dependency of the interface is more reflected in the page structure. Often, the results returned by the previous layer and the interface will determine the display of the next layer of pages. ```Vue Pipe``` abstracts this interface call level and reflects it on the component.

## v-pipe 

The component ```v-pipe``` represents a series of dependency levels, which can contain any component
#### properties
-name: String
Optional, represents the name of the current level
-graph: String
Required, represents the dependency relationship, and is identified by the name of ```v-pipe``` or ```v-valve``` in the child node, for example: ```a> b> c,d, e```. ```a> b``` represents ```b```depends on ```a```, ```c,d,e``` represents a level relationship

## v-valve

The component ```v-valve``` represents a single request
#### properties
-name: String
Required, represents the name of the current request
-request: Function<() => Promise>
Required, represents the method body of the current request
-valve: Any
Required, represents the target data modified after the current request is completed

#### slot
-default
Any component under normal circumstances
-loading
The component that will be displayed when loading

## skills 
```v-pipe``` can be nested and used to show more dependencies, such as:
```javascript
<v-pipe graph="a > b > c">
    ...
    <v-pipe name="b" graph="d > e > f">
        ...
    </v-pipe>
    ...
</v-pipe>

```


Example: 
