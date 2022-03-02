import React from "react";
import type { FC } from "react"
import { Box, Grid, Typography, Button } from '@mui/material';
import Paper from "@mui/material/Paper";

interface CardProps {
    data: number[];
}

const Card: FC<CardProps> = ({ data }: CardProps) => {
    return (
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={2}>
                {data.map((value) => (
                    <Grid key={value} item>
                    <Paper
                        sx={{
                        height: 280,
                        width: 370,
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#1A2027" : "#000000"
                        }}
                    />
                    </Grid>
                ))}
                </Grid>
            </Grid>
        </Grid>
    )
}
export default Card;