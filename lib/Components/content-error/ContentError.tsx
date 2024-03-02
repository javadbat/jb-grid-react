import React from 'react';
import './content-error.scss';
type ContentErrorProps = {
    onRefreshBtnClick:()=>unknown,
    message?:string,
    title?:string,
    refreshButtonTitle?:string,
}
function ContentError(props:ContentErrorProps) {
    return (
        <div className="content-error">
            <div className="error-image">😬😓🤔</div>
            <div className="error-text" style={{ padding: " 0 0 0 0" }}>{props.title}</div>
            <div className="error-text">{props.message}</div>
            <div className="error-button"><button onClick={props.onRefreshBtnClick}>{props.refreshButtonTitle}</button></div>
        </div>
    );
}

export default ContentError;