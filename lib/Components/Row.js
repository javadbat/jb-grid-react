import React from 'react'

function Row(props) {
    const {style, children, className} = props;
    return (
        <div className={`jb-grid-table-row ${className??''}`} style={style}>
            {children}
        </div>
    )
}

export default Row
