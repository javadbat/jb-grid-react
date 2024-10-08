import React, { ReactNode, useEffect } from 'react';
import JBGridViewModel, { JBGridContext } from './JBGridViewModel';
import { observer } from 'mobx-react';
import './JBGrid.scss';
export { JBGridData } from './JBGridData';
import 'jb-searchbar';
import { AnyObject, JBGridBridgeClassInterface, JBGridConfig, JBGridI18nConfig, SearchbarConfig } from './Types';
import Footer from './Footer';
import Header from './Header';
import Content from './Content';
import { useMobx } from '../../../common/hooks/useMobx';
export { Row } from './Components/Row';
export { Cell } from './Components/Cell';
export { ExpandRow } from './Components/ExpandRow';

export type JBGridProps<T extends AnyObject> = {
  searchbarConfig?: SearchbarConfig | null | undefined,
  config: JBGridConfig<T>,
  bridge: JBGridBridgeClassInterface,
  isFullscreen?: boolean,
  className?: string,
  style?: React.CSSProperties,
  onFullscreenChange?: (isFullscreen: boolean) => void,
  title: string,
  i18n?: JBGridI18nConfig | null | undefined,
  contentError?: ReactNode,
  headerEndComponents?: ReactNode[] | ReactNode,
  children?: React.ReactNode | React.ReactNode[]

}
function JBGridComponent<T extends AnyObject>(props: JBGridProps<T>) {
  const vm = useMobx(JBGridViewModel<AnyObject>, [props, props.config, props.bridge]);
  useEffect(() => {
    vm.onComponentDidMount(props.searchbarConfig || null);
  }, []);

  useEffect(() => {
    if(props.i18n){
      vm.setI18n(props.i18n);
    }
  }, [props.i18n]);

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
        <Header title={props.title} vm={vm} searchbarConfig={props.searchbarConfig} headerEndComponents={props.headerEndComponents}></Header>
        <Content i18n={vm.i18n} config={vm.config} isErrorOccurred={vm.isErrorOccurred} isLoading={vm.isLoading} refreshBtnClick={vm.refreshBtnClick} setSortColumn={vm.setSortColumn} styles={vm.styles} errorComponent={props.contentError}>{props.children}</Content>
        <Footer isFullscreen={props.isFullscreen ?? false} vm={vm}></Footer>
      </div>
    </JBGridContext.Provider>
  );
}

export const JBGrid = observer(JBGridComponent);
