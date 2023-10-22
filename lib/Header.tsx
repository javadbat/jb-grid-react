import React from 'react';
import JBGridViewModel from './JBGridViewModel';
import { JBSearchbarWebComponent } from 'jb-searchbar';
type HeaderProps = {
    vm:JBGridViewModel,
    title:string,
    searchbarConfig:any,
    headerEndComponents?:React.ReactNode[]
}
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'jb-searchbar': JBSearchbarType;
      }
      interface JBSearchbarType extends React.DetailedHTMLProps<React.HTMLAttributes<JBSearchbarWebComponent>, JBSearchbarWebComponent> {
        class?:string,
      }
    }
}
function Header(props:HeaderProps) {
    const {vm} = props;
    return (
        <section key={'jb-grid-header'} className="jb-grid-header">
            <section className={"main-section " + (vm.config.states.headerSection == "MAIN" ? "" : "hidden")}>
                <section className="jb-grid-title">{props.title}</section>
                <section className="button-container">
                    {
                        props.headerEndComponents?.map((component, index) => {
                            return (<div key={index} className="custom-component-wrapper-header-end">{component}</div>);
                        })
                    }
                    {

                        props.searchbarConfig && (
                            <div className="filter-btn btn" onClick={() => { vm.openSearchHeaderSection(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 36 30" height="30px" id="Layer_1" version="1.1" viewBox="0 0 36 30" width="36px"><polygon points="14,30 22,25 22,17 35.999,0 17.988,0 0,0 14,17 " /></svg>
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

export default Header;