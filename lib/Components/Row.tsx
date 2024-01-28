import React from 'react';
import './Row.scss';
import { useJBGridVM } from '../JBGridViewModel';
function Row(props) {
    const { children, className} = props;
    const vm = useJBGridVM();
    if(!vm){
        return <React.Fragment></React.Fragment>;
    }
    return (
        <div className={`jb-grid-table-row ${className??''}`} style={{gridTemplateColumns:vm.styles.table.generalCols.gridTemplateColumns}}>
            {children}
        </div>
    );
}

export {Row};
