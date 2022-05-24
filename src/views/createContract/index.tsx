import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, Divider, Container, FormControl, Select, MenuItem, Button, Radio, FormControlLabel, OutlinedInput, InputAdornment, RadioGroup } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { BigNumber, Contract } from "ethers";
import useCurrency from "src/hooks/useCurrency";
import { ChainId, Opthys } from 'opthy-v1-core';
import useContract from "src/hooks/useContract";
import { parseUnits } from "@ethersproject/units";
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
import { LoadingButton } from "@mui/lab";
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {
        minWidth: '70%'
    },
    boxHeader: {
        height: '8px'
    },
    boxHeader2: {
        height: '40px'
    },
    paperTransparent: {
        backgroundColor: "transparent !important",
    },
    customProgress: {
        "& .MuiLinearProgress-bar": {
            borderRadius: "5px 0px 0px 5px !important",
            borderRight: "3px solid" + theme.palette.background.default,
        },
    },
    customRadioGroup: {
        "& .MuiFormControlLabel-root": {
            flexBasis: "50%",
            flexGrow: "0",
            maxWidth: "50%",
            marginLeft: "0px",
            marginRight: "0px",
        },
    },
}));

interface formValues {
    swapRate: BigNumber,
    day: BigNumber,
    hours: BigNumber
    minute: BigNumber,
    second: BigNumber,
    feeAmount: BigNumber
}
interface formError {
    tokenZero: boolean,
    tokenOne: boolean,
    swapRate: boolean,
    day: boolean,
    hours: boolean
    minute: boolean,
    second: boolean,
    feeAmount: boolean
}


const CreateContract: FC = () => {
    const classes = useStyles();
    const zeroBigNumber = BigNumber.from(0);
    const tokens = [{ address: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84", symbol: "DAI" }, { address: "0xc778417E063141139Fce010982780140Aa0cD5Ab", symbol: "WETH" }];

    const [feeCurrency, setFeeCurrency] = React.useState<string>('DAI');
    const [contractFor, setContractFor] = React.useState<string>('charge');
    const [tokenZero, setTokenZero] = React.useState<string>('');
    const [tokenOne, setTokenOne] = React.useState<string>('');
    const [convertAmount, setConvertAmount] = React.useState<number>(0);
    const [showError, setShowError] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [values, setValues] = React.useState<formValues>({
        swapRate: zeroBigNumber,
        day: zeroBigNumber,
        hours: zeroBigNumber,
        minute: zeroBigNumber,
        second: zeroBigNumber,
        feeAmount: zeroBigNumber,
    });
    const [errors, setErrors] = React.useState<formError>({
        tokenZero: true,
        tokenOne: true,
        swapRate: true,
        day: true,
        hours: true,
        minute: true,
        second: true,
        feeAmount: true
    });

    const { address, ABI } = Opthys(ChainId.RinkebyTestnet);
    const { convertResult, currencyIsValidating } = useCurrency(feeCurrency);
    const contract: Contract | any = useContract(address, ABI);

    const handleChange = (prop: string) => (event: { target: { value: any; }; }) => {
        setValues({ ...values, [prop]: event.target.value });
        setErrors({ ...errors, [prop]: event.target.value > 0 ? false : true });
        if (prop === 'feeAmount') {
            if (currencyIsValidating === false) {
                setConvertAmount(Number(event.target.value) * convertResult?.Price);
            }
        }
    };

    const liquidityHandleChange = async (event: { target: { value: React.SetStateAction<string> } }): Promise<void> => {
        setErrors({ ...errors, tokenZero: !!event.target.value ? false : true, tokenOne: !!event.target.value ? false : true });
        setTokenZero(event.target.value);
        setTokenOne(!!event.target.value ? event.target.value === tokens[0].address ? tokens[1].address : tokens[0].address : "");
    };

    const swappableHandleChange = async (event: { target: { value: React.SetStateAction<string> } }): Promise<void> => {
        setErrors({ ...errors, tokenZero: !!event.target.value ? false : true, tokenOne: !!event.target.value ? false : true });
        setTokenOne(event.target.value);
        setTokenZero(!!event.target.value ? event.target.value === tokens[0].address ? tokens[1].address : tokens[0].address : "");
    };

    const createOpthy = async (): Promise<void> => {
        let errorStatus: boolean = false;
        if (!!errors.tokenZero || !!errors.tokenOne || !!errors.swapRate || !!errors.day || !!errors.hours || !!errors.minute || !!errors.second || !!errors.feeAmount){ errorStatus = true; setShowError(true); }
        if(!errorStatus){
            setLoading(true);
            // console.log(errors, contractFor, values, tokenZero, tokenOne);
            let date = new Date();
            try {
                const txResponse: TransactionResponse = await contract.createNewOpthy(
                    contractFor === 'charge' ? true : false, //we are providing liquidity
                    parseUnits(values.swapRate.toString(), 18), // how much DAI the buyer will have to pay to purchase this contract
                    Math.round(Math.round(date.setDate(date.getDate() + Number(values.day))) / 1000), // 10000000000, //The contract expires 7 days from now! (It's expressed in seconds since Epoch)
                    tokenZero, //DAI is token0
                    tokenOne, //WETH is token1
                    parseUnits(values.feeAmount.toString(), 18), //max amount of DAI in the contract
                    parseUnits("1", 18), //max amount of WETH in the contract 3333333333333333
                    "10000000000000000000" //what we are providing of DAI/token0
                );
                
                console.log("Create Transaction Response = ", txResponse);
                const txReceipt: TransactionReceipt = await txResponse.wait();
                console.log("Create txReceipt = ", txReceipt)
                console.log("Create txReceipt log = ", txReceipt.logs[0])
                setLoading(false);
                // Swal.close();
                alert("Contract Created Successfully");
            } catch (error: any) {
                console.error(error);
                setLoading(false);
                alert(error.message);
            }
            
        }
    }

    React.useEffect(() => {
        if(currencyIsValidating === false) {
            setConvertAmount(Number(values.feeAmount) * convertResult?.Price);
        }
    }, [convertResult, currencyIsValidating, values.feeAmount]);

    return (
        <Page title="Create Contract">
            <Box m={2} mt={10}>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                        <Typography variant="h4">Create Contract</Typography>
                        <Typography>Liquidity at your own terms</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Container className={classes.customContainer}>
                <Box m={1} textAlign='center'>
                    <Typography align="center">Do you want to request liquidity or provide liquidity? </Typography>
                </Box>

                <Box m={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="liquidityType"
                                value={contractFor}
                                onChange={(event) => setContractFor(event.target.value)}
                                className={classes.customRadioGroup}
                            >
                                <FormControlLabel value="charge" control={<Radio />} label="I'm charging a fee to providing liquidity" />
                                <FormControlLabel value="pay" control={<Radio />} label="I'm paying a fee to providing liquidity" />
                            </RadioGroup>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography m={1}> Liquidity Provider </Typography>
                            <FormControl sx={{ m: 1, width: '53ch' }}>
                                {/* <InputLabel id="chrage-label">Select Liquidity Provider</InputLabel> */}
                                <Select
                                    labelId="chrage-label"
                                    // id="chrage"
                                    // open={openZero}
                                    // onClose={() => setOpenZero(false)}
                                    // onOpen={() => setOpenZero(true)}
                                    value={tokenZero}
                                    // label="DAI"
                                    onChange={liquidityHandleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {tokens.map((getToken, index) =>
                                        <MenuItem value={getToken.address} key={index}>{getToken.symbol}</MenuItem>
                                    )}
                                </Select>
                                {showError && errors?.tokenZero && <Typography component="span" m={1} sx={{ color: 'red', fontSize: '14px' }}>Choose Liquidity Provider!</Typography>}
                            </FormControl>

                            <Box m={1} mt={6} sx={{ width: '53ch' }} style={{display: 'flex',justifyContent: 'space-between'}}>
                                <Typography style={{ display: 'block' }}> Fixed Swap Rate </Typography>
                                <div>
                                <Typography style={{ display: 'block', marginBottom: "0px",color: '#35a2a5' }} gutterBottom variant="body2">Toggle Order</Typography>
                                <Typography style={{ display: 'block', }} variant="caption" color="text.secondary">{tokenOne && "1 " + tokens.filter(val => val.address === tokenOne)[0].symbol + " = "} {tokenZero && "60K " + tokens.filter(val => val.address === tokenZero)[0].symbol}</Typography>
                                </div>
                            </Box>
                            <FormControl sx={{ m: 1, width: '53ch' }} variant="outlined">
                                <OutlinedInput
                                    autoComplete="off"
                                    id="outlined-adornment-weight"
                                    onChange={handleChange('swapRate')}
                                    endAdornment={<InputAdornment position="end">{tokenZero && tokens.filter(val => val.address === tokenZero)[0].symbol + " = 1"} {tokenOne && tokens.filter(val => val.address === tokenOne)[0].symbol}</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'swapRate',
                                    }}
                                />
                                {showError && errors?.swapRate && <Typography component="span" m={1} sx={{ color: 'red', fontSize: '14px', display: 'block' }}>Please enter Fixed Swap Rate!</Typography>}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography m={1}> Swappable Asset </Typography>
                            <FormControl sx={{ m: 1, width: '53ch' }}>
                                {/* <InputLabel id="demo-controlled-open-select-label">Select SA</InputLabel> */}
                                <Select
                                    labelId="demo-controlled-open-select-label"
                                    // id="demo-controlled-open-select"
                                    // open={openOne}
                                    // onClose={() => setOpenOne(false)}
                                    // onOpen={() => setOpenOne(true)}
                                    value={tokenOne}
                                    // label="DAI"
                                    onChange={swappableHandleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {tokens.map((getToken, index) =>
                                        <MenuItem value={getToken.address} key={index}>{getToken.symbol}</MenuItem>
                                    )}
                                </Select>
                                {showError && errors?.tokenOne && <Typography component="span" m={1} sx={{ color: 'red', fontSize: '14px', display: 'block' }}>Choose Swappable Asset!</Typography>}

                            </FormControl>

                            <Typography m={1} mt={6}> Duration </Typography>
                            <Typography style={{ display: 'block', marginBottom: "0px" }} gutterBottom variant="body2" color="text.secondary">&nbsp;</Typography>

                            <FormControl sx={{ m: 1, width: '12ch' }} style={{marginBottom: "0"}} variant="outlined">
                                <OutlinedInput
                                    autoComplete="off"
                                    id="outlined-adornment-weight"
                                    // value={values.day}
                                    onChange={handleChange('day')}
                                    endAdornment={<InputAdornment position="end">DDD</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'day',
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '12ch' }} style={{marginBottom: "0"}} variant="outlined">
                                <OutlinedInput
                                    autoComplete="off"
                                    id="outlined-adornment-weight"
                                    // value={values.hours}
                                    onChange={handleChange('hours')}
                                    endAdornment={<InputAdornment position="end">HHH</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'hour',
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '12ch' }} style={{marginBottom: "0"}} variant="outlined">
                                <OutlinedInput
                                    autoComplete="off"
                                    id="outlined-adornment-weight"
                                    // value={values.minute}
                                    onChange={handleChange('minute')}
                                    endAdornment={<InputAdornment position="end">MMM</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'minute',
                                    }}
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '12ch' }} style={{marginBottom: "0"}} variant="outlined">
                                <OutlinedInput
                                    autoComplete="off"
                                    id="outlined-adornment-weight"
                                    // value={values.second}
                                    onChange={handleChange('second')}
                                    endAdornment={<InputAdornment position="end">SSS</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'second',
                                    }}
                                />
                            </FormControl>
                            {(showError && (errors?.day || errors?.hours || errors?.minute || errors?.second)) && <Typography component="span" m={1} sx={{ color: 'red', fontSize: '14px', display: 'block' }}>Please enter valid Duration!</Typography>}

                        </Grid>

                        <Grid item xs={12} md={6} style={{margin: '0 auto'}}>

                            <FormControl sx={{ m: 1, width: '53ch' }} variant="outlined">
                                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography style={{ display: 'inline-block', }} gutterBottom> Fee </Typography>
                                    <Typography style={{ display: 'inline-block', }} gutterBottom variant="body2" color="text.secondary">{!currencyIsValidating ? '~$' + convertAmount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' USD' : 'wait...' }</Typography>
                                </Box>
                                <OutlinedInput
                                    autoComplete="off"
                                    id="outlined-adornment-weight"
                                    onChange={handleChange('feeAmount')}
                                    endAdornment={<><FormControl>
                                    <Select style={{width: '120px',marginRight: '50px'}} value={feeCurrency} onChange={(event) => setFeeCurrency(event.target.value)}>
                                        {tokens.map((getToken, index) =>
                                            <MenuItem value={getToken.symbol} key={index}>{getToken.symbol}</MenuItem>
                                        )}
                                    </Select></FormControl></>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'feeAmount',
                                    }}
                                    style={{padding: '0 0 0'}}
                                />
                                {showError && errors?.feeAmount && <Typography component="span" m={1} sx={{ color: 'red', fontSize: '14px', display: 'block' }}>Please enter Fee!</Typography>}

                            </FormControl>
                        </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "30px" }} />
                    <Grid container spacing={2} mt={0} justifyContent="center">
                        <Grid item>
                        { loading === true ? 
                            <LoadingButton sx={{ m: 3 }} loading variant="outlined"> Submit </LoadingButton>
                            : 
                            <Button sx={{ m: 1, width: '25ch' }} variant="contained" onClick={createOpthy} color="primary">Create</Button>
                        }
                            
                        </Grid>
                    </Grid>
                </Box>

            </Container>
        </Page>
    )
}

export default CreateContract;