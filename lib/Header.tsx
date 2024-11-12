import React, { ReactNode } from 'react';
import JBGridViewModel from './JBGridViewModel.js';
import { JBSearchbarWebComponent } from 'jb-searchbar';
import { observer } from 'mobx-react';
type HeaderProps = {
    vm: JBGridViewModel<any>,
    title: string,
    searchbarConfig: any,
    headerEndComponents?: React.ReactNode[] | ReactNode
}
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            'jb-searchbar': JBSearchbarType;
        }
        interface JBSearchbarType extends React.DetailedHTMLProps<React.HTMLAttributes<JBSearchbarWebComponent>, JBSearchbarWebComponent> {
            class?: string,
        }
    }
}
function Header(props: HeaderProps) {
  const { vm } = props;
  return (
    <section key={'jb-grid-header'} className="jb-grid-header">
      <section className={"main-section " + (vm.config.states.headerSection == "MAIN" ? "" : "hidden")}>
        <section className="jb-grid-title">{props.title}</section>
        <section className="button-container">
          {
            Array.isArray(props.headerEndComponents) &&
                        props.headerEndComponents?.map((component, index) => {
                          return (<div key={index} className="custom-component-wrapper-header-end">{component}</div>);
                        })
          }
          {
            !Array.isArray(props.headerEndComponents) &&
                        <div className="custom-component-wrapper-header-end">{props.headerEndComponents}</div>
          }
          {

            props.searchbarConfig && (
              <div className="filter-btn btn" onClick={() => { vm.openSearchHeaderSection(); }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 24 24" fill="none">
                  <g>
                    <path d="M4.00001 3C3.62123 3 3.27497 3.214 3.10558 3.55279C2.93619 3.89157 2.97274 4.29698 3.20001 4.6L8.80001 12.0667C8.92983 12.2398 9.00001 12.4503 9.00001 12.6667V20C9.00001 20.3466 9.17946 20.6684 9.47427 20.8507C9.76909 21.0329 10.1372 21.0494 10.4472 20.8944L14.4472 18.8944C14.786 18.725 15 18.3788 15 18V12.6667C15 12.4503 15.0702 12.2398 15.2 12.0667L20.8 4.6C21.0273 4.29698 21.0638 3.89157 20.8944 3.55279C20.725 3.214 20.3788 3 20 3H4.00001Z" />
                  </g>
                </svg>
              </div>
            )}
        </section>
      </section>
      <section className={"search-section " + (vm.config.states.headerSection == "SEARCH" ? "" : "hidden")}>
        <div className="close-btn" onClick={() => { vm.openMainHeaderSection(); }}>
          <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 224.512 224.512">
            <g>
              <polygon points="224.507,6.997 217.521,0 112.256,105.258 6.998,0 0.005,6.997 105.263,112.254    0.005,217.512 6.998,224.512 112.256,119.24 217.521,224.512 224.507,217.512 119.249,112.254  " />
            </g>
          </svg>
        </div>
        <div className="search-bar-wrapper">{
          props.searchbarConfig &&
                    <jb-searchbar ref={vm.elements.searchbar}></jb-searchbar>
        }
        </div>
      </section>
    </section>
  );
}

export default observer(Header) ;