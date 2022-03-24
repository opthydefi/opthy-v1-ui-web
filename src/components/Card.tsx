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
import moment from 'moment';

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
    },
    boxHeader: {
        height: '8px'
    }
}));

interface CardProps {
    data: any;
}

export const OpthyCard: FC<CardProps> = ({ data }: CardProps) => {
    const classes = useStyles();

    const [btcTousd, setBtcTousd] = React.useState(0);
    const [daiTousd, setDaiTousd] = React.useState(0);

    React.useEffect(() => {
        getBTCToUSD();
        async function getBTCToUSD(){
            const result = await (await fetch('https://api.diadata.org/v1/quotation/BTC', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })).json();
            setBtcTousd(result.Price);
        }
    });

    React.useEffect(() => {
        getDAIToUSD();
        async function getDAIToUSD(){
            const result = await (await fetch('https://api.diadata.org/v1/quotation/DAI', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })).json();
            setDaiTousd(result.Price);
        }
    });


    const now = Math.floor(Date.now() / 1000);
    const expire = parseInt(data.expiration._hex);
    let delta = expire - now;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60;

    return (
        <Card sx={{ m: 1, borderRadius: '10px' }}>
            {/* <CardActionArea> */}
                <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                <CardContent>
                {/* <Box> */}
                    <Grid container>
                        <Grid item xs={1.5}>
                            <Typography gutterBottom variant="h5" component="div">BTC</Typography>
                        </Grid>
                        <Grid item xs={6} mt={2}>
                            <Divider light={true} sx={{ borderBottomWidth: 10, borderRadius: 2 }} />
                        </Grid>
                        <Grid item xs={3} mt={2}>
                            <Divider sx={{ borderBottomWidth: 10, borderRadius: 2 }} />
                        </Grid>
                        <Grid item xs={1.5}>
                            <Typography align="right" gutterBottom variant="h5" component="div">DAI</Typography>
                        </Grid>
                    </Grid>
                {/* </Box> */}
                <Grid container spacing={2} mt={0}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Fixed Swap Rate: 
                            <Box p={1}>
                                {/* <Typography gutterBottom variant="body2">1 BTC = 60k DAI</Typography>
                                <Typography gutterBottom variant="body2">2 DAI = 0.001 BTC</Typography> */}
                                <Typography gutterBottom variant="body2">{parseInt(data.rT0._hex)} DAI</Typography>
                                <Typography gutterBottom variant="body2">{parseInt(data.rT1._hex)} BTC</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Expires In: 
                            <Typography gutterBottom variant="body2">{days +' days ' + hours + 'h. ' + minutes + 'm. ' + seconds + 's.'}</Typography>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Current: 
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">{parseInt(data.balanceT0._hex)} DAI</Typography>
                                <Typography gutterBottom variant="body2"> {parseInt(data.balanceT0._hex)} DAI</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography variant="body2" color="text.secondary">~ ${(parseInt(data.balanceT0._hex) * daiTousd).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                <Typography variant="body2" color="text.secondary">~ ${(parseInt(data.balanceT0._hex) * daiTousd).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid> 
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Liquidity Limit:
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">{parseInt(data.balanceT0._hex)} DAI</Typography>
                                <Typography gutterBottom variant="body2"> {parseInt(data.balanceT0._hex)} DAI</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ ${(parseInt(data.balanceT0._hex) * daiTousd).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ ${(parseInt(data.balanceT0._hex) * daiTousd).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                { parseInt(data.liquidityProviderFeeAmount._hex) > 0 ? 
                <>
                <Divider/>
                <Grid container spacing={2} mt={0}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Get unlimited swaps for:
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">{ parseInt(data.liquidityProviderFeeAmount._hex) } DAI</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ ${(parseInt(data.liquidityProviderFeeAmount._hex) * daiTousd).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                            </Box>                
                            
                        </Typography>
                    </Grid>
                </Grid></> : "" }
                </CardContent>
            {/* </CardActionArea> */}
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