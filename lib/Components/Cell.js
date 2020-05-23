import React from 'react'

function Cell(props) {
    const {children, caption, className} = props;
    return (
        <div  className={`jb-grid-table-cell ${className??''}`} data-caption={caption}>{children}</div>
    )
}

export default Cell
