import React from "react";
import type { FC } from "react"
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Box, Grid } from '@mui/material';
import type { Theme } from 'src/types/theme';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        minHeight: '100%',
        padding: theme.spacing(3)
    }
}));



interface CardProps {
    data: any;
}

export const OpthyCard: FC<CardProps> = ({ data }: CardProps) => {
    const classes = useStyles();
    return (
        <Card sx={{ m: 1 }}>
            <CardActionArea>
                <CardContent>
                <Box>
                    <Typography gutterBottom variant="h5" component="div">
                        BTC
                    </Typography>
                </Box>
                <Grid container spacing={2} mt={0}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Fixed Swap Rate: 
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">1 BTC = 60k DAI</Typography>
                                <Typography gutterBottom variant="body2">2 DAI = 0.001 BTC</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Expires In: 
                            <Typography gutterBottom variant="body2">120 days 3h. 10m. 2s.</Typography>
                        </Typography>
                        
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Current: 
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">9.11111111 BTC</Typography>
                                <Typography gutterBottom variant="body2"> 53,333.33 DAI</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography variant="body2" color="text.secondary">~ $610,444.44 USD</Typography>
                                <Typography variant="body2" color="text.secondary">~ $53,333.33 USD</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid> 
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Liquidity Limit:
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">10.00 BTC</Typography>
                                <Typography gutterBottom variant="body2"> 600,000.00 DAI</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ $610,444.44 USD</Typography>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ $53,333.33 USD</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                <Divider/>
                <Grid container spacing={2} mt={0}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Get unlimited swaps for:
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">2.111111 BTC</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ $141,444.44 USD</Typography>
                            </Box>                          
                            
                        </Typography>
                    </Grid>
                </Grid>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Grid container spacing={2} mt={0} justifyContent="center">
                    <Grid item>
                        <Button size="medium" sx={{ m: 1 }} variant="contained" color="primary">View Offer</Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )
}