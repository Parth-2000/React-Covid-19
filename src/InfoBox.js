import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox-selected'} ${isRed && 'infoBox-red'}`}>
            <CardContent>
                <Typography className="infoBox-title" color="textSecondary">
                    { title }
                </Typography>
                <h2 className={`infoBox-cases ${!isRed && "infoBox-cases-green" }`}>{ cases }</h2>
                <Typography className="infoBox-total"  color="textSecondary">
                    { total } Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
