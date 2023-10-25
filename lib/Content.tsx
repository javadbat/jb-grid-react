import { observer } from 'mobx-react';
import React from 'react';
import JBGridViewModel from './JBGridViewModel';
import JBLoading from './Components/JBLoading';
import { JBGridColumnDef, JBGridConfig, JBGridStyles } from './Types';
export type ContentProps = {
    children:React.ReactNode,
    refreshBtnClick:()=>void,
    config:JBGridConfig<any>,
    isErrorOccurred:boolean,
    styles:JBGridStyles,
    isLoading:boolean,
    setSortColumn:(column: JBGridColumnDef) => void
}
function Content(props:ContentProps) {
    const {refreshBtnClick,config,isErrorOccurred,styles,isLoading,setSortColumn} = props;
    return (
        <section key={'jb-grid-content'} className="jb-grid-content">
            {
                isErrorOccurred && (
                    <div className="error-panel">
                        <div className="error-image">😬😓🤔</div>
                        <div className="error-text" style={{ padding: " 0 0 0 0" }}>すみません</div>
                        <div className="error-text">{config.i18n.messages.serverErrorText}</div>
                        <div className="error-button"><button onClick={refreshBtnClick}>تلاش مجدد</button></div>
                    </div>
                )}
            {
                !isErrorOccurred &&
                [
                    <section className="table-header" key='table-header'>
                        <div className="table-header-wrapper" style={{ ...styles.table.generalCols, ...styles.table.scrollIndent }}>
                            {
                                config.table.columns.map((item) => {
                                    return (
                                        <div onClick={() => setSortColumn(item)} key={item.name + '-' + item.id + '-' + "jb-grid-table-header"} title={item.name} className={'header-item ' + (item.sortable ? 'sortable-col' : '')}>
                                            <div className="caption-wrapper">{item.title}</div>
                                            {
                                                item.sort && (
                                                    <div className={"sort-icon-wrapper"}>
                                                        <svg className={'--' + item.sort.toLowerCase()} version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 31.479 31.479">
                                                            <path d="M26.477,10.274c0.444,0.444,0.444,1.143,0,1.587c-0.429,0.429-1.143,0.429-1.571,0l-8.047-8.047  v26.555c0,0.619-0.492,1.111-1.111,1.111c-0.619,0-1.127-0.492-1.127-1.111V3.813l-8.031,8.047c-0.444,0.429-1.159,0.429-1.587,0  c-0.444-0.444-0.444-1.143,0-1.587l9.952-9.952c0.429-0.429,1.143-0.429,1.571,0L26.477,10.274z" />
                                                        </svg>

                                                    </div>
                                                )}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </section>
                    ,
                    <section className="table-content" key='table-content'>
                        <div className="table-content-wrapper">
                            {props.children}
                        </div>
                    </section>
                ]

            }

            {
                isLoading ? (
                    <section className="loading">
                        <div className="loading-content">
                            <JBLoading></JBLoading>
                        </div>
                    </section>
                )
                    : ''
            }
        </section>
    );
}

export default observer(Content);