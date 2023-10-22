import React from 'react';
import JBGridViewModel from './JBGridViewModel';
import { observer } from 'mobx-react';
import './JBGrid.scss';

import 'jb-searchbar';
import { JBGridBridgeClassInterface, JBGridBridgeInterface } from './Types';
import Footer from './Footer';
import Header from './Header';
import Content from './Content';

export type JBGridProps = {
    searchbarConfig:any,
    config:any,
    bridge:JBGridBridgeClassInterface,
    isFullscreen:boolean,
    className:string,
    style: React.CSSProperties,
    onFullscreenChange?:(isFullscreen:boolean)=>void,
    title:string,
}
class JBGrid extends React.Component<JBGridProps> {
    vm:JBGridViewModel;
    constructor(props:JBGridProps) {
        super(props);
        this.vm = new JBGridViewModel(props, props.config, props.bridge);
    }
    componentDidMount() {
        this.vm.onComponentDidMount(this.props.searchbarConfig);
    }
    componentDidUpdate(prevProps:JBGridProps) {
        this.vm.onComponentDidUpdate(prevProps, this.props);
    }
    render() {
        const vm = this.vm;
        const props = this.props;
        if(!vm.config){
            return(<></>);
        }
        return (
            <div className={"jb-grid-wrapper " + (this.props.className ?? "")} ref={(dom) => vm.JBGridComponentDom = dom} style={props.style}>
                <Header title={this.props.title} vm={vm} searchbarConfig={props.searchbarConfig}></Header>
                <Content vm={vm}>{this.props.children}</Content>
                <Footer isFullscreen={this.props.isFullscreen} vm={vm}></Footer>
            </div>
        );
    }

}
export default observer(JBGrid) ;
