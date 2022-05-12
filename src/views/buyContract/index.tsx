import React, { FC } from "react";
// import { Link, useHistory, useLocation } from "react-router-dom";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, CardActions, Container, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';
import { useEthersState } from 'src/contexts/EthereumContext';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { OpthyCard } from "src/components/Card";
import { Buy } from "src/components/Buy";
import { Swap } from "src/components/Swap";
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { formatUnits, parseEther } from '@ethersproject/units';
import { ChainId, ERC20, OpthyABI } from 'opthy-v1-core';
import {ContractInterface, ethers} from "ethers";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
// import { LogDescription } from "ethers/lib/utils";
// import useSWR from 'swr';
import moment from 'moment';
import { LoadingButton } from "@mui/lab";
// import { useERC20Metadata, CURRENCY_CONVERT } from "src/utils/helpers";
import useSingleOpthy from "src/hooks/useSingleOpthy";
// import useTransactions from "src/hooks/useTransactions";

declare let window:any

// const { address, ABI } = ERC20(ChainId.RinkebyTestnet);
// console.log("ERCMetaData = ", ABI, address);
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


const BuyContract: FC = () => {
    const { viewContractAddress } = useEthersState();
    const classes = useStyles();
    let { ethereum } = window;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const [liquidityBuyLoading, setLiquidityBuyLoading] = React.useState<boolean>(false);
    const [buyable, setBuyable] = React.useState<buyContract>({status: false, message: "Please approve before Buy."})
    const [liquidityBuyable, setLiquidityBuyable] = React.useState<buyContract>({status: false, message: "Please approve before Buy."})
    const [liquidityBuy, setLiquidityBuy] = React.useState<boolean>(false);
    const [swapperBuy, setSwapperBuy] = React.useState<boolean>(false);
    const [transactionLog, setTransactionLog] = React.useState<Array<{}>>([]);

    const { singleOpthy, isValidating } = useSingleOpthy();
    // const transactionLogs = useTransactions();
    // console.log("singleOpthy = ", singleOpthy);

    // function isInt(n: number){
    //     return Number(n) === n && n % 1 === 0;
    // }
    function isFloat(n: number){
        return Number(n) === n && n % 1 !== 0;
    }

    const clickLiquidityBuyContract = async (): Promise<void> => {
        if(liquidityBuyable?.status === true){
            const liquidityAmount = formatUnits(singleOpthy[0].liquidityProviderFeeAmount, singleOpthy.liquidityProviderTokenDetails.decimals);
            if(Number(liquidityAmount) > 0){
                try {
                    setLiquidityBuyLoading(true);
                    const contract = new ethers.Contract(viewContractAddress, opthyABI, signer);
                    const txResponse: TransactionResponse = await contract.buyLiquidityProviderRole(
                        singleOpthy[0].liquidityProviderFeeToken,
                        singleOpthy[0].liquidityProviderFeeAmount
                    );
                    console.log("Buy Liquidity Transaction Response = ", txResponse);
                    const txReceipt: TransactionReceipt = await txResponse.wait();
                    // await expirationMutate(singleOpthy.opthyExpiration,true);
                    // await swapFeeMutate(opthySwapFee,true);
                    // await lpFeeMutate(opthyLpFee,true);
                    setLiquidityBuyLoading(false);
                    setLiquidityBuy(true);
                    // await opthyMutate(opthys, true);
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

    React.useEffect(() => {
        getPastEvents();
        async function getPastEvents(){
            try {
                const logs = await provider.getLogs({
                    fromBlock: 0,
                    toBlock: "latest",
                    address: viewContractAddress,
                    // topics: [null],
                });
                const newLogs = logs.map(async function(log) {
                    const logData = await provider.getTransactionReceipt(log.transactionHash);
                    logData['timestamp'] = (await provider.getBlock(logData.blockNumber)).timestamp;
                    return logData;
                })
                const getAllLogs = await Promise.all(newLogs);
                // console.log("getAllLogs = ", getAllLogs);
                setTransactionLog(getAllLogs)
            } catch (error) {
                console.log(error);
            }
        }
    }, [swapperBuy, liquidityBuy, provider, viewContractAddress]);

    // Event Call
    // React.useEffect(() => {
    //     if(!ethereum) return
    //     if(!userCurrentAddress) return
    //     const provider = new ethers.providers.Web3Provider(ethereum)
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

    // React.useEffect(() => {
    //     buyLiquidityProviderCheck();
    //     async function buyLiquidityProviderCheck(){
    //         const contract = new ethers.Contract(viewContractAddress, opthyABI, signer);
    //         console.log("opthyABI contract = ", contract, opthyABI);
    //         // const buyLPCheck = await contract.liquidityProvider();
    //         // if(userCurrentAddress == buyLPCheck){
    //         //     console.log("Liquidity Provider buy true");
    //         // } else {
    //         //     console.log("Liquidity Provider buy false");
    //         // }
    //         // console.log("buy Liquidity Provider check = ", userCurrentAddress + " || " + buyLPCheck);
    //     }
    // },[])

    // React.useEffect(() => {
    //     buySwapperCheck();
    //     async function buySwapperCheck(){
    //         const contract = new ethers.Contract(viewContractAddress, opthyABI, signer);
    //         const buySwapperChk = await contract.swapper();
    //         if(userCurrentAddress == buySwapperChk){
    //             console.log("Swapper buy true");
    //         } else {
    //             console.log("Swapper buy false");
    //         }
    //         console.log("buy Swapper Provider check = ", userCurrentAddress + " || " + buySwapperChk);
    //     }
    // },[])

    
    
    
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
            <Box m={2}>
                <Grid container spacing={2}>                   
                    {/* Opthy card loop  */}
                    <Grid item xs={12} md={4}>
                        <OpthyCard data={singleOpthy[0]} calledFrom="buyContract" buyableProp={buyable} liquidityBuy={liquidityBuy} swapperBuy={swapperBuy} setSwapperBuy={setSwapperBuy} />
                    </Grid>
                    {/* Opthy card loop  */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ m: 1, borderRadius: '10px' }}>
                            <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                            <CardContent>
                                <Typography align="center" variant="h5">Providing Liquidity</Typography>
                                <Divider />
                                <Typography align="center" variant="h5">{singleOpthy?.token1Details.symbol}/{singleOpthy?.token0Details.symbol}</Typography>
                                
                                <Grid container spacing={2} mt={0}>
                                    <Grid item xs={12}>
                                        <Paper elevation={0} className={classes.paperTransparent}>
                                            <Typography variant="body2" color="text.secondary">Value at Maturity, minimum * between: </Typography>
                                            <Box p={1}>
                                                <Typography gutterBottom variant="body2">{Number(formatUnits(singleOpthy[0].rT0, singleOpthy?.token0Details.decimals))} {singleOpthy?.token0Details.symbol}</Typography>
                                                <Typography gutterBottom variant="body2">{ parseFloat(formatUnits(singleOpthy[0].rT1, singleOpthy?.token1Details.decimals)).toFixed(isFloat(Number(formatUnits(singleOpthy[0].rT1, singleOpthy?.token1Details.decimals))) === true ? 4 : 2) } {singleOpthy?.token1Details.symbol}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} mt={1}>
                                    <Grid item xs={12}>
                                        <Paper elevation={0} className={classes.paperTransparent}>
                                            <Typography variant="body2" color="text.secondary">Matures In: </Typography>
                                            <Box p={1}>
                                                <Typography gutterBottom variant="body2">{singleOpthy?.opthyExpiration}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            { Number(formatUnits(singleOpthy[0]?.liquidityProviderFeeAmount, singleOpthy?.liquidityProviderTokenDetails.decimals)) > 0 ?
                            <CardActions>
                                <Grid container spacing={2} mt={0} justifyContent="center">
                                    <Grid item>
                                        {liquidityBuyLoading ? 
                                            <LoadingButton sx={{ m: 1 }} loading variant="outlined"> Submit </LoadingButton> : 
                                            !liquidityBuy ? 
                                            <Button onClick={clickLiquidityBuyContract} size="medium" sx={{ m: 1 }} variant="contained" color="primary">Buy</Button> : ""
                                        }
                                    </Grid>
                                </Grid>
                            </CardActions>
                            : "" }
                        </Card>
                    </Grid>        
                </Grid>
            </Box>
            { swapperBuy || liquidityBuy ?
            <Swap data={singleOpthy[0]} />
            :
            <Buy contractAddress={viewContractAddress} data={singleOpthy} buyable={buyable} setBuyable={setBuyable} liquidityBuyable={liquidityBuyable} setLiquidityBuyable={setLiquidityBuyable} /> 
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