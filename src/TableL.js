import React from 'react'
import './TableL.css'

function TableL({countries}) {
    return (
        <div className="table">
            {
                countries.map(({country, cases}) => {
                   return <tr>
                        <td>{country}</td>
                        <td><strong>{cases}</strong></td>
                    </tr>
                })
            }
        </div>
    )
}

export default TableL
