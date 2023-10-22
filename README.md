# jb-grid-react
import files
```js
import {JBGrid} from 'jb-grid-react'
import {Cell} from 'jb-grid-react/cell'
import {Row} from 'jb-grid-react/row'
import JBGridData from 'jb-grid-react/data'
```
## instructions

### config

### fullscreen grid

jb-grid has a fullscreenable feature and you can activite that by set `isFullscreen={value:bool}` for example

```js

    <JBGrid isFullscreen={this.state.isFullscreen} onFullscreenChange={(newValue)=>this.setState({isFullscreen : newValue})}></JBGrid>

```
