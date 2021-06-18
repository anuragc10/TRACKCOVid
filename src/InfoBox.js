import React from 'react';
import "./InfoBox.css";

import { Card, CardContent,Typography } from '@material-ui/core';
export default function InfoBox({title,cases,active,isRed,total,...props}) {
    return (
        // <div className="infoBox">
            <Card
            onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${
                isRed && "infoBox--red"
              }`}>
                <CardContent>
                    <Typography className="infoBox__title" color="textSecondary">
                        {title}
                    </Typography>

                    <h2 className="infoBox__cases">{cases}</h2>

                    <Typography className="infoBox__total" color="textSecondary">
                        {total} - Total
                    </Typography>
                </CardContent>
            </Card>
            
        // </div>
    )
}
