import React from 'react';
import './Cell.scss';
type CellProps = {
    children?: React.ReactNode | React.ReactNode[],
    label?: string,
    className?: string,
    flex?:boolean;
}
function Cell(props: CellProps) {
  const { children, label, className, flex } = props;
  return (
    <div className={"jb-grid-table-cell " + (className ? className : '')} title={label}>
      <div className="cell-label">{label}</div>
      <div className={"cell-value " + (flex?'flex-cell':'')}>{children}</div>
    </div>
  );
}

export { Cell };
