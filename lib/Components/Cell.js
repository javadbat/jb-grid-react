import React from 'react';
import './Cell.scss';
function Cell(props) {
    const {children, caption, className} = props;
    return (
        <div className={"jb-grid-table-cell "+ (className?className:'')} data-caption={caption?caption:''}>{children}</div>
    );
}

export {Cell};
