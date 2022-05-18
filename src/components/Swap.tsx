import React from "react";
import type { FC } from "react"
import { Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/material';
import type { Theme } from 'src/types/theme';
import makeStyles from '@mui/styles/makeStyles';
import { useEthersState } from 'src/contexts/EthereumContext';
// import { ethers } from "ethers"; // ContractInterface
import { formatUnits } from '@ethersproject/units'; // parseEther, parseUnits
import useERC20Metadata from "src/hooks/useERC20Metadata";
import useCurrency from "src/hooks/useCurrency";
import useTokenBalance from "src/hooks/useTokenBalance";
import { ChainId, OpthyABI } from 'opthy-v1-core';
import useContract from "src/hooks/useContract";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import { Contract } from "ethers";
import { LoadingButton } from "@mui/lab";

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

interface SwapProps {
    data: any;
}

interface State {
    inputAmount: string;
}

export const Swap: FC<SwapProps> = ({ data }: SwapProps) => {
    // console.log("data = ", data);
    const classes = useStyles();
    const { userCurrentAddress } = useEthersState();
    const opthyABI = OpthyABI(ChainId.RinkebyTestnet);
    const contract: Contract | any = useContract(data.opthy, opthyABI);

    const token_0 = useERC20Metadata(data?.token0);
    const token_1 = useERC20Metadata(data?.token1);

    const { data: token0Balance } = useTokenBalance(userCurrentAddress, data?.token0);
    const { data: token1Balance } = useTokenBalance(userCurrentAddress, data?.token1);

    const [dai, setDai] = React.useState<string>('');
    const [dai2, setDai2] = React.useState<string>('');
    const [open, setOpen] = React.useState<boolean>(false);
    const [open2, setOpen2] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    // const [userBalance, setUserBalance] = React.useState<string | undefined>()
    const [values, setValues] = React.useState<State>({ inputAmount: '0' });

    const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setDai(event.target.value);
        setDai2(((event.target.value === token_0?.symbol) ? token_1?.symbol: token_0?.symbol));
    };

    const inputHandleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleChange2 = (event: { target: { value: React.SetStateAction<string> } }) => {
        setDai2(event.target.value);
        setDai(((event.target.value === token_0?.symbol) ? token_1?.symbol: token_0?.symbol));
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    const handleOpen2 = () => {
        setOpen2(true);
    };

    const convertToken0Cur = useCurrency(token_0?.symbol);
    const convertToken1Cur = useCurrency(token_1?.symbol);
    
    // provider.getBalance(userCurrentAddress)
    // .then((result: ethers.BigNumberish)=> {
    //     setUserBalance(ethers.utils.formatEther(result))
    // });

    const swapClick = async(): Promise<void> => {
        let error: boolean = false; 
        let errorMessage: string = "";
        const inputValue = Number(values.inputAmount);
        const t0Balance = Number(formatUnits(token0Balance, token_0?.decimals));
        const t1Balance = Number(formatUnits(token1Balance, token_1?.decimals));
        if(dai && inputValue){
            let selectedToken;
            if(dai === token_0?.symbol) selectedToken = 'token0';
            if(dai === token_1?.symbol) selectedToken = 'token1';

            if(selectedToken === 'token0'){
                if(inputValue > t0Balance){
                    error = true;
                    errorMessage = "Sorry! Max allow " + t0Balance + " " + token_0?.symbol;
                }
            }

            if(selectedToken === 'token1'){
                if(inputValue > t1Balance){
                    error = true;
                    errorMessage = "Sorry! Max allow " + t1Balance + " " + token_1?.symbol;
                }
            }

            if(!error) {
                setLoading(true);
                let inAmountT0_: number = 0;
                let inAmountT1_: number = 0;
                let outAmountT0_: number = 0;
                let outAmountT1_: number = 0;
                if(selectedToken === 'token0'){
                    inAmountT0_ = inputValue;
                    outAmountT1_ = Number(formatUnits(data?.balanceT1, token_0?.decimals))
                }
                if(selectedToken === 'token1'){
                    inAmountT1_ = inputValue;
                    outAmountT0_ = Number(formatUnits(data?.balanceT0, token_0?.decimals))
                }
                // console.log("swap click = ", data.opthy, inAmountT0_, inAmountT1_, outAmountT0_, outAmountT1_);
                try {
                    const txResponse: TransactionResponse = await contract.swap(
                        inAmountT0_, inAmountT1_, outAmountT0_, outAmountT1_
                    );
                    console.log("Swap Transaction Response = ", txResponse);
                    const txReceipt: TransactionReceipt = await txResponse.wait();
                    console.log("Swap txReceipt = ", txReceipt)
                    console.log("Swap txReceipt log = ", txReceipt.logs[0])
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            } else {
                alert(errorMessage);
            }
        } else {
            alert("Sorry! Please Choose Token");
        }
    }

    return (
        <>
        <Box m={2}>
            <Grid container spacing={2}>
                <Grid item xs={12} m={1}>
                    <Typography variant="h6">Swap at the Fixed Rate?</Typography>
                </Grid>
            </Grid>
            <Grid container spacing={2}>              
                {/* Opthy card loop  */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ m: 1, borderRadius: '10px', minHeight: 209 }}>
                        <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                        <CardContent sx={{padding: '0px 0px 0px 155px'}}>
                            <Grid container spacing={2} mt={0}>
                                <Grid item xs={12}>
                                    <Typography m={1}> From </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl sx={{ m: 1, width: '40ch' }}>
                                        <InputLabel id="demo-controlled-open-select-label">From</InputLabel>
                                        <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                        open={open}
                                        onClose={handleClose}
                                        onOpen={handleOpen}
                                        value={dai}
                                        label="DAI"
                                        onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>Choose From</em>
                                            </MenuItem>
                                            <MenuItem value={token_0?.symbol}>{token_0?.symbol}</MenuItem>
                                            <MenuItem value={token_1?.symbol}>{token_1?.symbol}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography m={1} sx={{display: 'inline-block'}}>Quantity: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                        {dai === token_0?.symbol && 
                                            <Typography sx={{display: 'inline-block'}} gutterBottom variant="body2">~ $
                                            {convertToken0Cur?.currencyIsValidating ? 0 : token0Balance && (Number(formatUnits(token0Balance, token_0?.decimals)) * convertToken0Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                                            USD</Typography>
                                        }

                                        {dai === token_1?.symbol && 
                                            <Typography sx={{display: 'inline-block'}} gutterBottom variant="body2">~ $
                                            {convertToken1Cur?.currencyIsValidating ? 0 : token1Balance && (Number(formatUnits(token1Balance, token_1?.decimals)) * convertToken1Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
                                            USD</Typography>
                                        }
                                    </Box>
                                    <FormControl sx={{ m: 1, width: '40ch' }} variant="outlined">
                                        <OutlinedInput
                                            id="outlined-adornment-weight"
                                            // value={values.inputAmount}
                                            onChange={inputHandleChange('inputAmount')}
                                            endAdornment={<InputAdornment position="end">{dai}</InputAdornment>}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                            'aria-label': 'inputAmount',
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Box m={1}>
                                <Typography gutterBottom variant="body2"> 
                                {dai ===  token_0?.symbol && token0Balance && "Use Max " + Number(formatUnits(token0Balance, token_0?.decimals)) + " " + token_0?.symbol + " limited by wallet balance" }

                                {dai ===  token_1?.symbol && token1Balance && "Use Max " + Number(formatUnits(token1Balance, token_1?.decimals)) + " " + dai + " limited by wallet balance"} 
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card sx={{ m: 1, borderRadius: '10px', minHeight: 327 }}> {/*, minHeight: 325*/}
                        <CardContent sx={{padding: '0px 0px 0px 155px'}}>
                            <Grid container spacing={2} mt={0}>
                                <Grid item xs={12}>
                                    <Typography m={1}> To </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography m={1} sx={{display: 'inline-block'}}>Quantity: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                        <Typography sx={{display: 'inline-block'}} gutterBottom variant="body2">~ ${((dai2 === token_0?.symbol) ? convertToken0Cur?.currencyIsValidating ? 0 : (Number(formatUnits(data?.balanceT0, token_0?.decimals)) * convertToken0Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'): convertToken1Cur?.currencyIsValidating ? 0 : (Number(formatUnits(data?.balanceT1, token_1?.decimals)) * convertToken1Cur?.convertResult?.Price).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'))} USD</Typography>
                                    </Box>
                                    <FormControl sx={{ m: 1, width: '40ch' }}>
                                        <InputLabel id="demo-controlled-open-select-label2">To</InputLabel>
                                        <Select
                                            labelId="demo-controlled-open-select-label2"
                                            id="demo-controlled-open-select2"
                                            open={open2}
                                            onClose={handleClose2}
                                            onOpen={handleOpen2}
                                            value={dai2}
                                            label="DAI"
                                            onChange={handleChange2}
                                        >
                                            <MenuItem value="">
                                                <em>Choose To</em>
                                            </MenuItem>
                                            <MenuItem value={token_0?.symbol}>{token_0?.symbol}</MenuItem>
                                            <MenuItem value={token_1?.symbol}>{token_1?.symbol}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>                 
                {/* Opthy card loop  */}                   
            </Grid>
        </Box>
        <Box m={2} mt={-2}>
            <Grid container spacing={2} justifyContent="center"> 
                <Grid item xs={12} >
                    <Card sx={{ m: 1, borderRadius: '10px' }}>
                        <CardContent>
                            <Typography m={1} variant="body2" align="center" > Contract Balance after : {Number(formatUnits(data?.balanceT0, token_0?.decimals)) + " " + token_0?.symbol + " / " + Number(formatUnits(data?.balanceT1, token_1?.decimals)) + " " + token_1?.symbol } </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                                    
            </Grid>
            
        </Box>
        <Box m={2} mt={-1}>
            <Grid container justifyContent="center">
                <Grid item>
                    { loading === true ? 
                    <LoadingButton sx={{ m: 3 }} loading variant="outlined"> Submit </LoadingButton>
                    : 
                    <Button onClick={swapClick} size="medium" variant="contained" color="primary">Approve {dai === "" ? token_0?.symbol : dai} to Swap</Button>
                    }
                </Grid>
            </Grid>
        </Box>
        </>
    )
}