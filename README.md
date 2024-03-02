# jb-grid-react

* @summary A React component for displaying a grid of items.
* @version 1.0.2
* @homepage https://github.com/javadbat/jb-grid-react#readme
* @license MIT

react mobx table grid with pagination, filtering and sorting functionality.

- responsive
- mobx ready
- easy filter implementation (customizable)
- customizable column templates
- flexible column size
- support for server side data fetching

## instructions

### install the package
```bash
npm i jb-grid
```
### import and use in your component
```JSX
import {Cell, Row, JBGrid} from 'jb-grid-react';
//this file is a class that implement `JBGridBridgeClassInterface` interface to translate your server data to jb-grid data interface see Bridge section for more detail
import {JBGridBridge} from './my-jbgrid-bridge';
// grid config that impl JBGridConfig type see config section for more detail
import {yourConfig} from './your-grid-config-file';
//jb-search-bar config so you can filter your data
import {filterConfig} from './my-filter-config';

<JBGrid config={yourConfig} bridge={JBGridBridge} title="user list" searchbarConfig={vm.filterConfig}></JBGrid>
```
### config

config is unique for each data table you want to show and contains information about columns,filters,sort,initData,...    
you can create your own config from scratch using Mobx class Stores that implements `JBGridConfigInterface` or just create instance of `JBGridData` and start to config it's fields base on your need.

```js
import { JBGridData } from "jb-grid-react";

const yourConfig = new JBGridData();
```
or in typescript: (in javascript you don't need to implements from `JBGridConfigInterface` but you have to check every detail manually to avoid errors)
```ts
import {JBGridConfigInterface}  from "jb-grid-react/types"

class yourConfigClass implements JBGridConfigInterface{
    //put your config here. for sample code see /lib/JBGridData in package files
}
export const yourConfig = new yourConfigClass();
```
you can config columns of table like this:    

```js
yourConfig.table.columns = [
            {
                //uniq identifier of column
                id: 1,
                //will be used as a key in sort  object when sorting by column
                name: 'name',
                //showed in column header
                title: 'نام',
                //let us sort column default is false
                sortable: true,
            },
            {
                id: 2,                
                name: 'age',
                title: 'سن',
                sortable: false,
                //if you dont set width , it will be '1fr' mean it get 1 share of width from free space
                width: '1fr'
            },
            {
                id: 3,
                name: 'expand',
                title: 'باز کردن',
                sortable: false,
                //you can set px,em, auto, fr , % , ... in here 
                width: '200px'
            }
        ];

```
to config backend service call config you can set `` like this:
```js
        // your api endpoint
        yourConfig.data.requestParams.url = "http://localhost:3000/grid/user-list",
        //endpoint http method
        yourConfig.data.requestParams.method = "POST";
        // you can set any custom parameter your backend needs here. for example if you using grpc or graphql you can set any config they need
        yourConfig.data.requestParams.custom1 = {aa:""};
        yourConfig.data.requestParams.foo = "x";
```
### actions

there is some actions you may want to call inside a grid for example you need to refresh data by code after some entity insert/update or fullscreen grid by code. for doing so you just have to call `actionDispatchers` methods in your grid config after initialization process (after render of jb-grid finish grid will automatically extend your config and add this methods).
```typescript
//action dispatcher type in typescript:
type ActionDispatchers = Readonly<{
    refreshData: () => Promise<void>,
    fullScreenGrid: () => void,
    exitFullScreenGrid: () => void
}>
// the call function:
    yourConfig.actionDispatchers.refreshData();
// 
```

### bridge

bridge is a js/ts class, responsible for converting jb-grid standard data to your back-end standard data and reverse.
jb-grid doesn't send request by it self, instead it ask bridge to send request & and receive data. so you have freedom to use whatever standard and technology you may see fit.
the reason that we separate config & bridge is most of the time all tables of your project use  same request and response data structure so you don't need to repeat yourself. you code 1 bridge for all of project and config each list for endpoints url ,...

### filter

### show list

### full-screen grid

jb-grid has a fullscreenable feature and you can activate that by set `isFullscreen={value:bool}` for example

```jsx
    const [isFullscreen,setIsFullscreen] = useState(false);
    <JBGrid isFullscreen={isFullscreen} onFullscreenChange={(newValue)=>setIsFullscreen(newValue)}></JBGrid>

```
### expandable row
you can add expandable row so user can expand row to see more info about a row in detail

```jsx
<JBGrid config={jbGridConfig} bridge={JBGridBridge} title="general list" searchbarConfig={filterConfig}>
    {
        jbGridConfig.data.data.map(
            (item) => {
                return (
                    <React.Fragment key={item.id}>
                        <Row>
                            <Cell>{item.name}</Cell>
                            <Cell>{item.age}</Cell>
                            <Cell><button onClick={()=>{item.jbGridDetail.isExpanded = !item.jbGridDetail.isExpanded;}}>detail</button></Cell>
                        </Row>
                        <ExpandRow show={item.jbGridDetail.isExpanded}>
                            <YourExpandedData></YourExpandedData>
                        </ExpandRow>
                    </React.Fragment>

                );
            }
        )
    }
</JBGrid>

```
## styling
| css variable name                          | description                                                            |
| -------------                              | -------------                                                          |
| --jb-grid-loading-color                    | list loading color                                                     |
| --jb-grid-page-active-color                | color of active page                                                   |
