import React from "react";
import type { FC } from "react"
import { Button, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import type { Theme } from 'src/types/theme';
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import { formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { useEthersState } from 'src/contexts/EthereumContext';
import {ContractInterface, ethers} from "ethers";
import { ChainId, ERC20, OpthyABI } from 'opthy-v1-core';
import useSWR from 'swr';
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import { LoadingButton } from "@mui/lab";

declare let window:any
const { address, ABI } = ERC20(ChainId.RinkebyTestnet);

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

interface BuyProps {
    contractAddress: string;
    data: any;
    buyable: {status: boolean, message: string};
    setBuyable: any;
    liquidityBuyable: {status: boolean, message: string};
    setLiquidityBuyable: any;
}

export const Buy: FC<BuyProps> = ({ contractAddress, data, buyable, setBuyable, liquidityBuyable, setLiquidityBuyable }: BuyProps) => {
    const classes = useStyles();
    const { userCurrentAddress } = useEthersState();
    let { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const { data: allowanceData, mutate: allowanceMutate, isValidating: allowanceValidating } = useSWR([ABI, data[0].swapperFeeToken, "allowance", userCurrentAddress, contractAddress ]);

    const [loading, setLoading] = React.useState<boolean>(false);
    const [liquidityLoading, setLiquidityLoading] = React.useState<boolean>(false);

    const clickApprove = async (role: string): Promise<void> => {
        try {
            const iface:ContractInterface = new ethers.utils.Interface(ABI)
            if(role === "swapper"){
                if(buyable?.status === false){
                    setLoading(true);
                    const contract = new ethers.Contract(data[0].swapperFeeToken, ABI, signer);
                    const txResponse: TransactionResponse = await contract.approve(
                        contractAddress,
                        parseEther("1000000000000")
                    );
                    console.log("Swapper approve transaction = ", txResponse);
                    const txReceipt: TransactionReceipt = await txResponse.wait();
                    await allowanceMutate(allowanceData, true);
                    // await opthyMutate(opthys, true);
                    setLoading(false);
                    console.log("txReceipt = ", txReceipt)
                    console.log("txReceipt log = ", txReceipt.logs[0])
                    // const event: LogDescription = iface.parseLog(txReceipt.logs[0])
                    // console.log("event = ", event)
                } else {
                    alert("Already aprroved. Please Buy")
                }
            }
            if(role === "liquidity"){
                if(liquidityBuyable?.status === false){
                    setLiquidityLoading(true);
                    const contract = new ethers.Contract(data[0].liquidityProviderFeeToken, ABI, signer);
                    const txResponse: TransactionResponse = await contract.approve(
                        contractAddress,
                        parseEther("1000000000000")
                    );
                    console.log("Liquidity approve transaction = ", txResponse);
                    const txReceipt: TransactionReceipt = await txResponse.wait();
                    await allowanceMutate(allowanceData, true);
                    setLiquidityLoading(false);
                    console.log("txReceipt = ", txReceipt)
                    console.log("txReceipt log = ", txReceipt.logs[0])
                    // const event: LogDescription = iface.parseLog(txReceipt.logs[0])
                    // console.log("event = ", event)
                } else {
                    alert("Already aprroved liquidity provider role. Please Buy")
                }
            }
        } catch (error: any) {
            alert(error.message);
            console.error(error);
        }
        
    }
    console.log("data = ", data);
    React.useEffect(() => {
        if(allowanceValidating === false){
            const swapperAmount = Number(formatUnits(data[0].swapperFeeAmount, data.swapperTokenDetails.decimals));
            const liquidityAmount = Number(formatUnits(data[0].liquidityProviderFeeAmount, data.liquidityProviderTokenDetails.decimals));
            if(swapperAmount > 0) {
                const allownaceAmount = Number(formatUnits(allowanceData, data.swapperTokenDetails.decimals));
                if(allownaceAmount > 0){
                    if(allownaceAmount > swapperAmount){
                        setBuyable({status: true, message: ""});
                    }
                }
            }
            if(liquidityAmount > 0) {
                const allownaceAmount = Number(formatUnits(allowanceData, data.liquidityProviderTokenDetails.decimals));
                if(allownaceAmount > 0){
                    if(allownaceAmount > liquidityAmount){
                        setLiquidityBuyable({status: true, message: ""});
                    }
                }
            }
        }
    }, [allowanceValidating]);

    if(allowanceValidating === true){
        return <Typography className={classes.loadingClass} gutterBottom variant="h5" component="div">Loading...</Typography>
    }

    return (
        <Box m={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} m={1}>
                    <Typography variant="h6">Buy this Contract?</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}> 
                <Grid item xs={12} md={6}>
                    <Card sx={{ m: 1, borderRadius: '10px' }}>
                        <Box className={classes.boxHeader2} sx={{backgroundColor: 'success.dark'}}>
                            <Typography align="center" style={{lineHeight: "2.0"}} variant="h6">SWAPPER</Typography>
                        </Box>
                        <CardContent>
                            <Box m={5}>
                                <Divider />
                            </Box>
                            <Box textAlign='center' m={5}>

                            { Number(formatUnits(data[0].swapperFeeAmount, data.swapperTokenDetails.decimals)) > 0 ? 
                                <>
                                <Typography align="center" variant="h5">Pay { parseFloat(formatUnits(data[0].swapperFeeAmount, data.swapperTokenDetails.decimals)).toFixed(2)} {data.swapperTokenDetails.symbol}</Typography>
                                <Typography align="center">to become the Swapper</Typography>

                                {buyable?.status === false ? 
                                    loading === true ? 
                                    <LoadingButton sx={{ m: 3 }} loading variant="outlined"> Submit </LoadingButton>
                                    : 
                                    <Button onClick={() => clickApprove("swapper")} size="medium" sx={{ m: 3 }} variant="contained" color="primary">Approve {data.swapperTokenDetails.symbol} to Buy</Button>
                                :
                                <Button sx={{ m: 3 }} variant="outlined" disabled> Approved </Button>
                                }
                                </>
                            :   <>
                                <Typography align="center" variant="h5">The Swapper Role</Typography>
                                <Typography align="center">is not on offer</Typography>
                                </>
                            }
                            </Box>
                            <Box m={5}>
                                <Divider />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ m: 1, borderRadius: '10px', minHeight: 386 }}>
                        <Box className={classes.boxHeader2} sx={{backgroundColor: 'warning.dark'}}>
                            <Typography align="center" style={{lineHeight: "2.0"}} variant="h6">LIQUIDITY PROVIDER</Typography>
                        </Box>
                        <CardContent>
                            <Box m={5}>
                                <Divider />
                            </Box>
                            <Box textAlign='center' m={5}>
                            { Number(formatUnits(data[0].liquidityProviderFeeAmount, data.liquidityProviderTokenDetails.decimals)) > 0 ? 
                                <>
                                <Typography align="center" variant="h5">Pay { parseFloat(formatUnits(data[0].liquidityProviderFeeAmount, data.liquidityProviderTokenDetails.decimals)).toFixed(2)} {data.liquidityProviderTokenDetails.symbol}</Typography>
                                <Typography align="center">to become the Liquidity Provider</Typography>

                                {liquidityBuyable?.status === false ? 
                                    liquidityLoading === true ? 
                                    <LoadingButton sx={{ m: 3 }} loading variant="outlined"> Submit </LoadingButton>
                                    : 
                                    <Button onClick={() => clickApprove("liquidity")} size="medium" sx={{ m: 3 }} variant="contained" color="primary">Approve {data.liquidityProviderTokenDetails.symbol} to Buy</Button>
                                :
                                <Button sx={{ m: 3 }} variant="outlined" disabled> Approved </Button>
                                }
                                </>
                            :   <>
                                <Typography align="center" variant="h5">The Liquidity Provider Role</Typography>
                                <Typography align="center">is not on offer</Typography>
                                </>
                            }
                            </Box>
                            <Box m={5}>
                                <Divider />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>                
            </Grid>
        </Box>
    )
}