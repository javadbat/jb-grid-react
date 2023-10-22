# jb-grid-react
import files
```js
import {JBGrid} from 'jb-grid-react'
import {Cell} from 'jb-grid-react/cell'
import {Row} from 'jb-grid-react/row'
import JBGridData from 'jb-grid-react/data'
```
## instructions

### install the package
```bash
npm i jb-grid
```
### import and use in your component
```JSX
import {Cell, Row, JBGrid} from 'jb-grid';
//this file is a class that impliment `JBGridBridgeClassInterface` interface to translate your server data to jbgrid data interface see Bridge section for more detail
import {JBGridBridge} from './my-jbgrid-bridge';
// grid config that impl JBGridConfig type see config section for more detail
import {config} from './my-grid-config';
//jb-search-bar config so you can filter your data
import {filterConfig} from './my-filter-config';

<JBGrid config={config} bridge={JBGridBridge} title="user list" searchbarConfig={vm.filterConfig}></JBGrid>
```
### config

### bridge

### filter

### show list

### fullscreen grid

jb-grid has a fullscreenable feature and you can activite that by set `isFullscreen={value:bool}` for example

```jsx
    const [isFullscreen,setIsFullscreen] = useState(false);
    <JBGrid isFullscreen={isFullscreen} onFullscreenChange={(newValue)=>setIsFullscreen(newValue)}></JBGrid>

```
