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
import { formatUnits } from '@ethersproject/units';
import { useERC20Metadata, CURRENCY_CONVERT } from "src/utils/helpers";
import { useEthersState } from 'src/contexts/EthereumContext';
import {ethers} from "ethers";

declare let window:any


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
    const { userCurrentAddress } = useEthersState();
    const [balance, setBalance] = React.useState<string | undefined>()

    let result: any = {}
    const { opthy: contractAddress, expiration, token0, token1, balanceT0, balanceT1, rT0, rT1 } = data;
    // console.log(contractAddress, expiration, token0, token1, balanceT0, balanceT1, rT0, rT1);
    result.address = contractAddress;
    
    // Expire Calculation
    const now = Math.floor(Date.now() / 1000);
    const expire = parseInt(expiration._hex);
    let delta = expire - now;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60;
    result.expiration = days +' days ' + hours + 'h. ' + minutes + 'm. ' + seconds + 's.';

    // User Balance
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    provider.getBalance(userCurrentAddress)
    .then((result)=> {
        setBalance(ethers.utils.formatEther(result))
    });
    result.currencyBalance = balance;

    // token0
    let token_0: any = {};
    token_0 = useERC20Metadata(token0);
    token_0.address = token0;
    token_0.balance = balanceT0;
    token_0.r = rT0;
    result.token0 = token_0;

    // token1
    let token_1: any = {};
    token_1 = useERC20Metadata(token1);
    token_1.address = token1;
    token_1.balance = balanceT1;
    token_1.r = rT1;
    result.token1 = token_1;

    // Swap rate
    result.fixedSwapRate0 = Number(formatUnits(rT1, token_1.decimals)) / Number(formatUnits(rT0, token_0.decimals));
    result.fixedSwapRate1 = Number(formatUnits(rT0, token_0.decimals)) / Number(formatUnits(rT1, token_1.decimals));

    // token0, token1 currency convert
    const convertToken0Cur = CURRENCY_CONVERT(result.token0.symbol);
    const convertToken1Cur = CURRENCY_CONVERT(result.token1.symbol);

    const newCal = Number(formatUnits(balanceT0, token_0.decimals)) / Number(formatUnits(rT0, token_0.decimals));
    const newCal2 = Number(formatUnits(balanceT1, token_1.decimals)) / Number(formatUnits(rT1, token_1.decimals));
    // console.log("newCal = ", formatUnits(balanceT1, token_1.decimals), formatUnits(rT1, token_1.decimals), newCal, newCal2);
    const [daiTousd, setDaiTousd] = React.useState(0);

    

    return (
        <Card sx={{ m: 1, borderRadius: '10px' }}>
            {/* <CardActionArea> */}
                <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                <CardContent>
                {/* <Box> */}
                    <Grid container>
                        <Grid item xs={1.5}>
                            <Typography gutterBottom variant="h5" component="div">DAI</Typography>
                        </Grid>
                        <Grid item xs={6} mt={2}>
                            <Divider light={true} sx={{ borderBottomWidth: 10, borderRadius: 2 }} />
                        </Grid>
                        <Grid item xs={3} mt={2}>
                            <Divider sx={{ borderBottomWidth: 10, borderRadius: 2 }} />
                        </Grid>
                        <Grid item xs={1.5}>
                            <Typography align="right" gutterBottom variant="h5" component="div">ETH</Typography>
                        </Grid>
                    </Grid>
                {/* </Box> */}
                <Grid container spacing={2} mt={0}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Fixed Swap Rate: 
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">1 {result.token0.symbol} {result.fixedSwapRate0 < 0.001 ? '<' : '=' } {result.fixedSwapRate0 < 0.001 ? 0.001: result.fixedSwapRate0} {result.token1.symbol}</Typography>
                                <Typography gutterBottom variant="body2">1 {result.token1.symbol} = {result.fixedSwapRate1} {result.token0.symbol}</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Expires In: 
                            <Typography gutterBottom variant="body2">{result.expiration}</Typography>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Current: 
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">{Number(formatUnits(balanceT0, result.token0.decimals))} {result.token0.symbol}</Typography>
                                <Typography gutterBottom variant="body2"> {Number(formatUnits(data.balanceT1, result.token1.decimals))} {result.token1.symbol}</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography variant="body2" color="text.secondary">~ ${convertToken0Cur?.currencyIsValidating ? 0 : (Number(formatUnits(balanceT0, result.token0.decimals)) * convertToken0Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                <Typography variant="body2" color="text.secondary">~ ${convertToken1Cur?.currencyIsValidating ? 0 : (Number(formatUnits(balanceT1, result.token1.decimals)) * convertToken1Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid> 
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            Liquidity Limit:
                            <Box p={1}>
                                <Typography gutterBottom variant="body2">{Number(formatUnits(rT0, result.token0.decimals))} {result.token0.symbol}</Typography>
                                <Typography gutterBottom variant="body2"> {Number(formatUnits(rT1, result.token1.decimals))} {result.token1.symbol}</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                            &nbsp;
                            <Box mt={1}>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ ${convertToken0Cur?.currencyIsValidating ? 0 : (Number(formatUnits(rT0, result.token0.decimals)) * convertToken0Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                <Typography gutterBottom variant="body2" color="text.secondary">~ ${convertToken1Cur?.currencyIsValidating ? 0 : (Number(formatUnits(rT1, result.token1.decimals)) * convertToken1Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                            </Box>
                        </Typography>
                    </Grid>
                </Grid>
                { Number(formatUnits(data.liquidityProviderFeeAmount, 18)) > 0 ? 
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