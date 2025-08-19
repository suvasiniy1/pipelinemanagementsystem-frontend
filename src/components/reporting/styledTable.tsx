import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#3f51b5',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 14,
    padding: '16px',
  },
  body: {
    fontSize: 13,
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f8f9fa',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#ffffff',
    },
    '&:hover': {
      backgroundColor: '#e3f2fd !important',
      cursor: 'pointer',
    },
    transition: 'background-color 0.2s ease',
  },
}))(TableRow);

const StyledTable = withStyles({
  root: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    '& .MuiTableContainer-root': {
      borderRadius: '8px',
    }
  },
})(Table);

interface StyledTableProps {
  headers: string[];
  rows: any[][];
  alignments?: ('left' | 'right' | 'center')[];
}

export const EnhancedTable: React.FC<StyledTableProps> = ({ headers, rows, alignments = [] }) => {
  return (
    <div style={{ 
      background: 'white', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <StyledTable>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <StyledTableCell key={index} align={alignments[index] || 'left'}>
                {header}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <StyledTableCell key={cellIndex} align={alignments[cellIndex] || 'left'}>
                  {cell}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </div>
  );
};