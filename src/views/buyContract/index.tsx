import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, Card, CardContent, CardActions, Button, Paper, Divider, List, ListItem, ListItemText } from '@mui/material';
import { useEthersState } from 'src/contexts/EthereumContext';
import { OpthyCard } from "src/components/Card";
import { Buy } from "src/components/Buy";
import { Swap } from "src/components/Swap";
import makeStyles from '@mui/styles/makeStyles';
import { formatUnits } from '@ethersproject/units'; //parseEther
import { ChainId, OpthyABI } from 'opthy-v1-core';
import { ethers } from "ethers";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import moment from 'moment';
import { LoadingButton } from "@mui/lab";
import useSingleOpthy from "src/hooks/useSingleOpthy";
import useTransactions from "src/hooks/useTransactions";
import useERC20Metadata from "src/hooks/useERC20Metadata";

const opthyABI = OpthyABI(ChainId.RinkebyTestnet);


const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {       
        minWidth: '100%'        
    },
    boxHeader: {
        height: '8px'
    },
    boxHeader2: {
        height: '40px'
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
    loadingClass: {
        marginTop: '10% !important',
        textAlign: 'center'
    }
}));

interface buyContract {
    status: boolean,
    message: string
}


const BuyContract: FC = (props: any) => {
    const viewContractAddress = props.match.params.address;
    const { provider, userCurrentAddress } = useEthersState();
    const classes = useStyles();

    const [liquidityBuyLoading, setLiquidityBuyLoading] = React.useState<boolean>(false);
    const [buyable, setBuyable] = React.useState<buyContract>({status: false, message: "Please approve before Buy."})
    const [liquidityBuyable, setLiquidityBuyable] = React.useState<buyContract>({status: false, message: "Please approve before Buy."})
    const [liquidityBuy, setLiquidityBuy] = React.useState<boolean>(false);
    const [swapperBuy, setSwapperBuy] = React.useState<boolean>(false);
    // const [transactionLog, setTransactionLog] = React.useState<Array<{}>>([]);

    const { singleOpthy, isValidating } = useSingleOpthy(viewContractAddress);
    let transactionLog = useTransactions(viewContractAddress);
    // console.log("singleOpthy = ", singleOpthy);


    // Expire Calculation
    const now = Math.floor(Date.now() / 1000);
    const expire = parseInt(singleOpthy?.expiration);
    let delta = expire - now;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60;
    const opthyExpiration = days +' days ' + hours + 'h. ' + minutes + 'm. ' + seconds + 's.';

    let token_0: any = {};
    token_0 = useERC20Metadata(singleOpthy?.token0);

    let token_1: any = {};
    token_1 = useERC20Metadata(singleOpthy?.token1);

    let lProviderDetail: any = {};
    lProviderDetail = useERC20Metadata(singleOpthy?.liquidityProviderFeeToken);

    // function isInt(n: number){
    //     return Number(n) === n && n % 1 === 0;
    // }
    function isFloat(n: number) {
        return Number(n) === n && n % 1 !== 0;
    }

    const clickLiquidityBuyContract = async (): Promise<void> => {
        if(liquidityBuyable?.status === true){
            const liquidityAmount = formatUnits(singleOpthy.liquidityProviderFeeAmount, singleOpthy.liquidityProviderTokenDetails.decimals);
            if(Number(liquidityAmount) > 0){
                try {
                    setLiquidityBuyLoading(true);
                    const contract = new ethers.Contract(viewContractAddress, opthyABI, provider.getSigner());
                    const txResponse: TransactionResponse = await contract.buyLiquidityProviderRole(
                        singleOpthy.liquidityProviderFeeToken,
                        singleOpthy.liquidityProviderFeeAmount
                    );
                    console.log("Buy Liquidity Transaction Response = ", txResponse);
                    const txReceipt: TransactionReceipt = await txResponse.wait();
                    setLiquidityBuyLoading(false);
                    setLiquidityBuy(true);
                    console.log("txReceipt = ", txReceipt)
                    console.log("txReceipt log = ", txReceipt.logs[0])
                } catch (error: any) {
                    console.error(error);
                    alert("Sorry! " + error.message);
                }
            } else {
                alert("Sorry! This liquidity role not buyable");
            }
        } else {
            alert(liquidityBuyable?.message);
        }
    }

    // Event Call
    // React.useEffect(() => {
    //     if(!ethereum) return
    //     if(!userCurrentAddress) return
    //     const erc20 = new ethers.Contract(opthyData.swapperDetails.token, ABI, provider);
    //     const approval = erc20.filters.Approval(userCurrentAddress, null);
    //     const opthyAddress = viewContractAddress;
    //     const amount = parseEther("1000000000000");
    //     // console.log("userCurrentAddress = ", userCurrentAddress, "opthyAddress = ", opthyAddress, "amount = ", amount)
    //     provider.on(approval, (userCurrentAddress, opthyAddress, amount) => {
    //         console.log("approval Event = ", userCurrentAddress)
    //     });
    //     return () => {
    //         provider.removeAllListeners(approval)
    //     }
    // }, [userCurrentAddress, opthyData]);

    // if(allowanceValidating === true){
    //     return <Typography className={classes.loadingClass} gutterBottom variant="h5" component="div">Loading...</Typography>
    // }

    React.useEffect(() => {
        buyLiquidityProviderCheck();
        async function buyLiquidityProviderCheck(){
            const contract = new ethers.Contract(viewContractAddress, opthyABI, provider.getSigner());
            const buyLPCheck = await contract.liquidityProvider();
            // console.log("Liquidity Check = ", buyLPCheck);
            if(userCurrentAddress === buyLPCheck){
                console.log("Liquidity Provider buy true");
            } else {
                console.log("Liquidity Provider buy false");
            }
            console.log("buy Liquidity Provider check: curAdd = ", userCurrentAddress + " || token = " + buyLPCheck);
        }
    },[provider, userCurrentAddress, viewContractAddress])

    React.useEffect(() => {
        buySwapperCheck();
        async function buySwapperCheck(){
            const contract = new ethers.Contract(viewContractAddress, opthyABI, provider.getSigner());
            const buySwapperChk = await contract.swapper();
            // console.log("Swapper Check = ", buySwapperChk);
            if(userCurrentAddress === buySwapperChk){
                console.log("Swapper buy true");
            } else {
                console.log("Swapper buy false");
            }
            console.log("buy Swapper Provider check: curAdd = ", userCurrentAddress + " || token = " + buySwapperChk);
        }
    },[provider, userCurrentAddress, viewContractAddress])
    
    
    if(isValidating === true){
        return <Typography className={classes.loadingClass} gutterBottom variant="h5" component="div">Loading...</Typography>
    }
    
    return (
        <Page title="Buy Contract">
            <Box m={2} mt={10}>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                        <Typography variant="h5" sx={{display: 'inline-block'}}>Contract &nbsp;</Typography>
                        <Box
                            component="span"
                            sx={{
                            display: 'inline-block',
                            visibility: 'visible',
                            my: 2,
                            p: 1,
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? '#0f69b78c' : 'grey.100',
                            color: (theme) =>
                                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                            border: '1px solid',
                            borderColor: (theme) =>
                                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                            borderRadius: 2,
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            }}
                        >
                            {viewContractAddress}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            { singleOpthy &&
            <Box m={2}>
                <Grid container spacing={2}>                   
                    {/* Opthy card loop  */}
                    <Grid item xs={12} md={4}>
                        <OpthyCard data={singleOpthy} calledFrom="buyContract" buyableProp={buyable} liquidityBuy={liquidityBuy} swapperBuy={swapperBuy} setSwapperBuy={setSwapperBuy} />
                    </Grid>
                    {/* Opthy card loop  */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ m: 1, borderRadius: '10px' }}>
                            <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                            <CardContent>
                                <Typography align="center" variant="h5">Providing Liquidity</Typography>
                                <Divider />
                                <Typography align="center" variant="h5">{token_1?.symbol}/{token_0?.symbol}</Typography>
                                
                                <Grid container spacing={2} mt={0}>
                                    <Grid item xs={12}>
                                        <Paper elevation={0} className={classes.paperTransparent}>
                                            <Typography variant="body2" color="text.secondary">Value at Maturity, minimum * between: </Typography>
                                            <Box p={1}>
                                                <Typography gutterBottom variant="body2">{Number(formatUnits(singleOpthy.rT0, token_0?.decimals))} {token_0?.symbol}</Typography>
                                                <Typography gutterBottom variant="body2">{ parseFloat(formatUnits(singleOpthy.rT1, token_1?.decimals)).toFixed(isFloat(Number(formatUnits(singleOpthy.rT1, token_1?.decimals))) === true ? 4 : 2) } {token_1?.symbol}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} mt={1}>
                                    <Grid item xs={12}>
                                        <Paper elevation={0} className={classes.paperTransparent}>
                                            <Typography variant="body2" color="text.secondary">Matures In: </Typography>
                                            <Box p={1}>
                                                <Typography gutterBottom variant="body2">{opthyExpiration}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            { Number(formatUnits(singleOpthy?.liquidityProviderFeeAmount, lProviderDetail?.decimals)) > 0 &&
                            <CardActions>
                                <Grid container spacing={2} mt={0} justifyContent="center">
                                    <Grid item>
                                        {liquidityBuyLoading ? 
                                            <LoadingButton sx={{ m: 1 }} loading variant="outlined"> Submit </LoadingButton> : 
                                            !liquidityBuy &&
                                            <Button onClick={clickLiquidityBuyContract} size="medium" sx={{ m: 1 }} variant="contained" color="primary">Buy</Button>
                                        }
                                    </Grid>
                                </Grid>
                            </CardActions>
                            }
                        </Card>
                    </Grid>        
                </Grid>
            </Box>
            }
            { singleOpthy && (
                swapperBuy || liquidityBuy ?
                <Swap data={singleOpthy} />
                :
                <Buy contractAddress={viewContractAddress} data={singleOpthy} buyable={buyable} setBuyable={setBuyable} liquidityBuyable={liquidityBuyable} setLiquidityBuyable={setLiquidityBuyable} /> )
            }

            <Box m={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                        <Typography variant="h6">Contract History</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                    { transactionLog?.length > 0 ?
                    <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
                    {transactionLog.map((log: any, index: any) => (
                        <ListItem
                        key={index}
                        >
                            <ListItemText sx={{ width: 100 }} primary={`${moment.unix(log.timestamp).format("YYYY-MM-DD")}`} />
                            <ListItemText sx={{ width: 100 }} primary={`${moment.unix(log.timestamp).format("HH:mm")}`} />
                            <ListItemText sx={{
                                width: 600,
                                padding: '4px 15px 4px 15px',
                                border: '1px solid',
                                bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? '#0f69b78c' : 'grey.100', 
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: (theme) =>
                                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                borderColor: (theme) =>
                                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                            }} primary={`Contract Transaction Hash: ${log.transactionHash}`} />
                        </ListItem>
                    ))}
                    </List>
                    : <Typography variant="h4">No Transaction Found</Typography>
                    }
                    </Grid>
                </Grid>
            </Box>
        </Page>
    )
}

export default BuyContract;