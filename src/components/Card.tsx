import React from "react";
import type { FC } from "react"
import { Button, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions, Box, Grid } from '@mui/material';
import type { Theme } from 'src/types/theme';
import makeStyles from '@mui/styles/makeStyles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { formatUnits } from '@ethersproject/units';
import { useERC20Metadata, CURRENCY_CONVERT } from "src/utils/helpers";
import { useEthersState } from 'src/contexts/EthereumContext';
import {ethers} from "ethers";
import { Link } from "react-router-dom";
import { ChainId, ERC20, OpthyABI } from 'opthy-v1-core';
import useSWR from 'swr';

declare let window:any
// const ERCMetaData = ERC20(ChainId.RinkebyTestnet);
// console.log("ERCMetaData = ", ERCMetaData);

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
    },
    paperTransparent:{
        backgroundColor: "transparent !important" ,
    },
    customProgress:{
        "& .MuiLinearProgress-bar": {
            borderRadius: "5px 0px 0px 5px !important",           
            borderRight: "3px solid" + theme.palette.background.default,
        },
    },
}));

interface CardProps {
    data: any;
    calledFrom: string;
    buyableProp?: {status: boolean, message: string};
}

export const OpthyCard: FC<CardProps> = ({ data, calledFrom, buyableProp }: CardProps) => {
    const classes = useStyles();
    const { userCurrentAddress } = useEthersState();
    const [balance, setBalance] = React.useState<string | undefined>()
    // console.log("calledFrom = ", calledFrom);


    let MyOpthys = OpthyABI(ChainId.RinkebyTestnet);
    console.log("MyOpthys = ", MyOpthys);


    let result: any = {}
    const { opthy: contractAddress, expiration, token0, token1, swapper, swapperFeeAmount, swapperFeeToken, liquidityProvider, liquidityProviderFeeAmount, liquidityProviderFeeToken, balanceT0, balanceT1, rT0, rT1 } = data;
    // console.log("allData = ",contractAddress, expiration, token0, token1, swapperFeeToken, balanceT0, balanceT1, rT0, rT1);
    result.address = contractAddress;
    
    // Expire Calculation
    const now = Math.floor(Date.now() / 1000);
    const expire = parseInt(expiration);
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
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // provider.getBalance(userCurrentAddress)
    // .then((result)=> {
    //     setBalance(ethers.utils.formatEther(result))
    // });
    // result.currencyBalance = balance;

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

    //Liquidity Provider Details
    let lProviderDetail: any = {};
    lProviderDetail = useERC20Metadata(liquidityProviderFeeToken);
    lProviderDetail.address = liquidityProvider;
    lProviderDetail.feeAmount = liquidityProviderFeeAmount;
    lProviderDetail.token = liquidityProviderFeeToken;
    result.liquidityProviderDetails = lProviderDetail;

    //Swapper Details
    let swapperDetail: any = {};
    swapperDetail = useERC20Metadata(swapperFeeToken);
    swapperDetail.address = swapper;
    swapperDetail.feeAmount = swapperFeeAmount;
    swapperDetail.token = swapperFeeToken;
    result.swapperDetails = swapperDetail;

    // Fixed Swap rate
    result.fixedSwapRate0 = Number(formatUnits(rT1, token_1.decimals)) / Number(formatUnits(rT0, token_0.decimals));
    result.fixedSwapRate1 = Number(formatUnits(rT0, token_0.decimals)) / Number(formatUnits(rT1, token_1.decimals));

    // token0, token1, swapper currency convert
    const convertToken0Cur = CURRENCY_CONVERT(result.token0.symbol);
    const convertToken1Cur = CURRENCY_CONVERT(result.token1.symbol);
    const convertSwapCur = CURRENCY_CONVERT(result.swapperDetails.symbol);

    const newCal = Number(formatUnits(balanceT0, token_0.decimals)) / Number(formatUnits(rT0, token_0.decimals));
    const newCal2 = Number(formatUnits(balanceT1, token_1.decimals)) / Number(formatUnits(rT1, token_1.decimals));
    result.bar1 = (Number(newCal) / (Number(newCal) + Number(newCal2))) * 100;
    result.bar2 = (Number(newCal2) / (Number(newCal) + Number(newCal2))) * 100;
    // console.log("newCal = ", result.bar1, result.bar2);

    function isFloat(n: number){
        return Number(n) === n && n % 1 !== 0;
    }

    // let { ethereum } = window;
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();

    const clickBuyContract = async (): Promise<void> => {
        if(buyableProp?.status === true){
            console.log("Yes Buyable");
                // const contract = new ethers.Contract(userCurrentAddress, ERCMetaData.ABI, signer);
                // const transaction = await contract.approve(
                //     "0x1Da9c71671f292819aE4680DA58d0a410BD1a009",
                //     "1000000000000000000"
                // );
        
                // await transaction.wait();
                // console.log("transaction = ", transaction)
                // await mutate(opthys, true);


            // const { data: opthyApprove, mutate: approveMutate, isValidating: approveValidating } = useSWR([ERCMetaData.ABI, "approve", "0x1Da9c71671f292819aE4680DA58d0a410BD1a009", "10000000000000000000"]);
            // console.log("opthyApprove = ", opthyApprove);
        } else {
            alert(buyableProp?.message);
        }
    }

    return (
        <Card sx={{ m: 1, borderRadius: '10px' }}>
            {/* <CardActionArea> */}
                <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                <CardContent>
                    { calledFrom === "contract" || calledFrom === "buyContract" ?
                        <><Typography align="center" variant="h5">Listed</Typography>
                        <Divider /></> : "" 
                    }
                    {/* <Box> */}
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item xs={1}>
                            <Typography variant="h5">DAI</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <BorderLinearProgress className={classes.customProgress} variant="determinate" value={result.bar1} />
                        </Grid>
                        <Grid item xs={1}>
                            <Typography align="right" variant="h5">ETH</Typography>
                        </Grid>
                    </Grid>
                    {/* </Box> */}
                    <Grid container spacing={2} mt={0}>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary">Fixed Swap Rate: </Typography>
                                <Box p={1}>
                                    <Typography gutterBottom variant="body2">1 {result.token0.symbol} {result.fixedSwapRate0 < 0.001 ? '<' : '=' } {result.fixedSwapRate0 < 0.001 ? 0.001: result.fixedSwapRate0} {result.token1.symbol}</Typography>
                                    <Typography gutterBottom variant="body2">1 {result.token1.symbol} = {result.fixedSwapRate1} {result.token0.symbol}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary"> Expires In: </Typography> 
                                <Box p={1}>
                                    <Typography gutterBottom variant="body2">{result.expiration}</Typography>
                                </Box>                            
                            </Paper>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary">Current: </Typography>
                                <Box p={1}>
                                    <Typography gutterBottom variant="body2">{Number(formatUnits(balanceT0, result.token0.decimals))} {result.token0.symbol}</Typography>
                                    <Typography gutterBottom variant="body2"> {Number(formatUnits(data.balanceT1, result.token1.decimals))} {result.token1.symbol}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary"> &nbsp; </Typography>
                                <Box mt={1}>
                                    <Typography variant="body2" color="text.secondary">~ ${convertToken0Cur?.currencyIsValidating ? 0 : (Number(formatUnits(balanceT0, result.token0.decimals)) * convertToken0Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                    <Typography variant="body2" color="text.secondary">~ ${convertToken1Cur?.currencyIsValidating ? 0 : (Number(formatUnits(balanceT1, result.token1.decimals)) * convertToken1Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid> 
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary"> Liquidity Limit: </Typography>
                                <Box p={1}>
                                    <Typography gutterBottom variant="body2">{Number(formatUnits(rT0, result.token0.decimals))} {result.token0.symbol}</Typography>
                                    <Typography gutterBottom variant="body2"> {Number(formatUnits(rT1, result.token1.decimals)).toFixed(isFloat(Number(formatUnits(rT1, result.token1.decimals))) === true ? 4 : 2)} {result.token1.symbol}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary"> &nbsp; </Typography>
                                <Box mt={1}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">~ ${convertToken0Cur?.currencyIsValidating ? 0 : (Number(formatUnits(rT0, result.token0.decimals)) * convertToken0Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                    <Typography gutterBottom variant="body2" color="text.secondary">~ ${convertToken1Cur?.currencyIsValidating ? 0 : (Number(formatUnits(rT1, result.token1.decimals)) * convertToken1Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                    { Number(formatUnits(swapperFeeAmount, result.swapperDetails.decimals)) > 0 ? 
                    <>
                    <Divider/>
                    <Grid container spacing={2} mt={0}>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary"> Get unlimited swaps for: </Typography>
                                <Box p={1}>
                                    <Typography gutterBottom variant="body2">{ Number(formatUnits(swapperFeeAmount, result.swapperDetails.decimals))} {result.swapperDetails.symbol}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper elevation={0} className={classes.paperTransparent}>
                                <Typography variant="body2" color="text.secondary"> &nbsp; </Typography>
                                <Box mt={1}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">~ ${convertSwapCur?.currencyIsValidating ? 0 : (Number(formatUnits(swapperFeeAmount, result.swapperDetails.decimals)) * convertSwapCur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} USD</Typography>
                                </Box>
                            </Paper>    
                        </Grid>
                    </Grid></> : "" }
                </CardContent>
            {/* </CardActionArea> */}
            <CardActions>
                <Grid container spacing={2} mt={0} justifyContent="center">
                    { calledFrom === "home" ?
                        <Grid item>
                            <Link to={"buy-contract?contractAddress=" + result.address + "&expiration=" + expiration + "&balanceT0=" + balanceT0 + "&balanceT1=" + balanceT1 + "&rT0=" + rT0 + "&rT1=" + rT1 + "&opthyDetails=" + JSON.stringify(result) }>
                                <Button size="medium" sx={{ m: 1 }} variant="contained" color="primary">View Offer</Button>
                            </Link>
                        </Grid>: "" 
                    }
                    { calledFrom === "buyContract" ?
                        <Grid item>
                            <Button onClick={clickBuyContract} size="medium" sx={{ m: 1 }} variant="contained" color="primary">Buy</Button>
                        </Grid>: "" 
                    }
                    { calledFrom === "contract" ?<>
                    <Button size="medium" sx={{ m: 1 }} variant="contained" color="primary">Swap</Button>
                    <Button size="medium" sx={{ m: 1 }} variant="contained" color="primary">Relist</Button></>
                    : "" }
                </Grid>
                
            </CardActions>
        </Card>
    )
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 12,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}));