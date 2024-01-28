import React from 'react';
import PropTypes from 'prop-types';
import './ExpandRow.scss';
function ExpandRow(props) {
    return (
        <section className={'jb-grid-expand-row' + (props.show?'':' --hidden')}>
            <div className={'expand-row-content' + (props.show?'':' --hidden')}>
                {props.children}
            </div>
        </section>
    );
}

ExpandRow.propTypes = {
    children: PropTypes.node,
    show: PropTypes.bool
};

export {ExpandRow};
