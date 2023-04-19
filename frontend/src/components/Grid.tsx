import React from 'react'
import './Grid.css'

interface GridProps {
  onSelectCell: (row: number, col: number) => void // a function to handle cell selection
}

const Grid: React.FC<GridProps> = ({ onSelectCell }) => {
  const rows = Array.from(Array(10).keys()) // generate an array of 0 to 9
  const cols = Array.from(Array(10).keys()) // generate an array of 0 to 9

  const rowLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] // array of row labels
  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] // array of column labels

  return (
    <div className="grid">
      <div className="row">
        <div className="cell corner" />
        {colLabels.map((colLabel) => (
          <div key={colLabel} className="cell col-label">
            {colLabel}
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row} className="row">
          <div className="cell row-label">{rowLabels[row]}</div>
          {cols.map((col) => (
            <div
              key={`${row},${col}`}
              className="cell"
              onClick={() => onSelectCell(row, col)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Grid
