import React from 'react';
import './Row.scss';
function Row(props) {
    const {style, children, className} = props;
    return (
        <div className={`jb-grid-table-row ${className??''}`} style={style}>
            {children}
        </div>
    );
}

export {Row};
