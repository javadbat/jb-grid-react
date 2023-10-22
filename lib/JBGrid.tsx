import React, { useEffect, createContext } from 'react';
import JBGridViewModel, { JBGridContext } from './JBGridViewModel';
import { observer } from 'mobx-react';
import './JBGrid.scss';
export { JBGridData } from './JBGridData';
import 'jb-searchbar';
import { JBGridBridgeClassInterface } from './Types';
import Footer from './Footer';
import Header from './Header';
import Content from './Content';
import { useMobx } from '../../../common/hooks/useMobx';
export {Row} from './Components/Row';
export {Cell} from './Components/Cell';
export type JBGridProps = {
    searchbarConfig: any,
    config: any,
    bridge: JBGridBridgeClassInterface,
    isFullscreen: boolean,
    className: string,
    style: React.CSSProperties,
    onFullscreenChange?: (isFullscreen: boolean) => void,
    title: string,
    children: React.ReactNode
}
function JBGridComponent(props: JBGridProps) {
    const vm = useMobx(JBGridViewModel, [props, props.config, props.bridge]);
    useEffect(() => {
        vm.onComponentDidMount(props.searchbarConfig);
    }, []);
    useEffect(() => {
        if (props.isFullscreen !== null && props.isFullscreen !== undefined) {
            vm.onFullscreenChanged(props.isFullscreen);
        }
    }, [props.isFullscreen]);
    if (!vm.config) {
        return (<></>);
    }
    return (
        <JBGridContext.Provider value={vm} key={"jb-grid-context"}>
            <div className={"jb-grid-wrapper " + (props.className ?? "")} ref={(dom) => vm.JBGridComponentDom = dom} style={props.style}>
                <Header title={props.title} vm={vm} searchbarConfig={props.searchbarConfig}></Header>
                <Content vm={vm}>{props.children}</Content>
                <Footer isFullscreen={props.isFullscreen} vm={vm}></Footer>
            </div>
        </JBGridContext.Provider>
    );
}

export const JBGrid = observer(JBGridComponent);
