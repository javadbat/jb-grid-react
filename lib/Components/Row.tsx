import React from 'react';
import './Row.scss';
import { useJBGridVM } from '../JBGridViewModel.js';
type RowProps = Omit<React.ComponentPropsWithoutRef<'div'>,"style">
function Row(props:RowProps) {
  const { children, className, ...otherProps} = props;
  const vm = useJBGridVM();
  if(!vm){
    return <React.Fragment></React.Fragment>;
  }
  return (
    <div className={`jb-grid-table-row ${className??''}`} style={{gridTemplateColumns:vm.styles.table.generalCols.gridTemplateColumns}} {...otherProps}>
      {children}
    </div>
  );
}

export {Row};
