# jb-grid-react

* @summary A React component for displaying a grid of items.
* @version 1.0.2
* @homepage https://github.com/javadbat/jb-grid-react#readme
* @license MIT

## instructions

### install the package
```bash
npm i jb-grid
```
### import and use in your component
```JSX
import {Cell, Row, JBGrid} from 'jb-grid-react';
//this file is a class that impliment `JBGridBridgeClassInterface` interface to translate your server data to jbgrid data interface see Bridge section for more detail
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
or in typescript: (in javascript you dont need to implements from `JBGridConfigInterface` but you have to check every detail manually to avoid errors)
```ts
import {JBGridConfigInterface}  from "jb-grid-react/types"

class yourConfigClass implements JBGridConfigInterface{
    //put your config here. for sample code see /lib/JBGridData in package files
}
export const yourConfig = new yourConfigClass();
```

### bridge

bridge is a js/ts class, responsible for converting jb-grid standard data to your back-end standard data and reverse.
jb-grid doesn't send request by it self, instead it ask bridge to send request & and receive data. so you have freedom to use whatever standard and technology you may see fit. 

### filter

### show list

### full-screen grid

jb-grid has a fullscreenable feature and you can activite that by set `isFullscreen={value:bool}` for example

```jsx
    const [isFullscreen,setIsFullscreen] = useState(false);
    <JBGrid isFullscreen={isFullscreen} onFullscreenChange={(newValue)=>setIsFullscreen(newValue)}></JBGrid>

```
## styling
| css variable name                          | description                                                            |
| -------------                              | -------------                                                          |
| --jb-grid-loading-color                    | list loading color                                                     |
| --jb-grid-page-active-color                | color of active page                                                   |
