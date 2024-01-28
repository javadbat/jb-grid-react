import React from 'react';
import './Cell.scss';
type CellProps = {
    children?: React.ReactNode | React.ReactNode[],
    caption?:string,
    className?:string
}
function Cell(props:CellProps) {
    const {children, caption, className} = props;
    return (
        <div className={"jb-grid-table-cell "+ (className?className:'')} data-caption={caption?caption:''}>{children}</div>
    );
}

export {Cell};
