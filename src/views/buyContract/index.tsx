import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, CardActions, Container, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { OpthyCard } from "src/components/Card";
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {       
        minWidth: '100%'        
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


const Contract: FC = () => {
    const classes = useStyles();
    const [dai, setDai] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setDai(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    // const data: any = {
    //     balanceT0: BigNumber {_hex: '0x8ac7230489e80000', _isBigNumber: true}
    //     balanceT1: BigNumber {_hex: '0x00', _isBigNumber: true}
    //     expiration: BigNumber {_hex: '0x02540be400', _isBigNumber: true}
    //     liquidityProvider: "0x9d23e5D38C31DF9FF11512e40f43a2a4Fa7a3b41"
    //     liquidityProviderFeeAmount: BigNumber {_hex: '0x00', _isBigNumber: true}
    //     liquidityProviderFeeToken: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84"
    //     opthy: "0x1Da9c71671f292819aE4680DA58d0a410BD1a009"
    //     rT0: BigNumber {_hex: '0x8ac7230489e80000', _isBigNumber: true}
    //     rT1: BigNumber {_hex: '0x0bd7a625405555', _isBigNumber: true}
    //     swapper: "0x9d23e5D38C31DF9FF11512e40f43a2a4Fa7a3b41"
    //     swapperFeeAmount: BigNumber {_hex: '0x0de0b6b3a7640000', _isBigNumber: true}
    //     swapperFeeToken: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84"
    //     token0: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84"
    //     token1: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
    // };
    return (
        <Page title="Contract">
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
                            45ab5471485cfaadeccabdef25631aef
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box m={2}>
                <Grid container spacing={2}>                   
                    {/* Opthy card loop  */}
                    <Grid item xs={12} md={4}>
                        <OpthyCard data={{
                            balanceT0: {_hex: '0x8ac7230489e80000', _isBigNumber: true},
                            balanceT1: {_hex: '0x00', _isBigNumber: true},
                            expiration: {_hex: '0x02540be400', _isBigNumber: true},
                            liquidityProvider: "0x9d23e5D38C31DF9FF11512e40f43a2a4Fa7a3b41",
                            liquidityProviderFeeAmount: {_hex: '0x00', _isBigNumber: true},
                            liquidityProviderFeeToken: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84",
                            opthy: "0x1Da9c71671f292819aE4680DA58d0a410BD1a009",
                            rT0: {_hex: '0x8ac7230489e80000', _isBigNumber: true},
                            rT1: {_hex: '0x0bd7a625405555', _isBigNumber: true},
                            swapper: "0x9d23e5D38C31DF9FF11512e40f43a2a4Fa7a3b41",
                            swapperFeeAmount: {_hex: '0x00', _isBigNumber: true},
                            swapperFeeToken: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84",
                            token0: "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84",
                            token1: "0xc778417E063141139Fce010982780140Aa0cD5Ab"
                        }} calledFrom="buyContract" />
                    </Grid>
                    {/* Opthy card loop  */}  
                    <Grid item xs={12} md={4}>
                        <Card sx={{ m: 1, borderRadius: '10px' }}>
                    
                            <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                            <CardContent>
                                <Typography align="center" variant="h5">Providing Liquidity</Typography>
                                <Divider />
                                <Typography align="center" variant="h5">BTC/DAI</Typography>
                                
                                <Grid container spacing={2} mt={0}>
                                    <Grid item xs={12}>
                                        <Paper elevation={0} className={classes.paperTransparent}>
                                            <Typography variant="body2" color="text.secondary">Value at Maturity, minimum * between: </Typography>
                                            <Box p={1}>
                                                <Typography gutterBottom variant="body2">10 DAI</Typography>
                                                <Typography gutterBottom variant="body2">0.3859674 WETH</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2} mt={1}>
                                    <Grid item xs={12}>
                                        <Paper elevation={0} className={classes.paperTransparent}>
                                            <Typography variant="body2" color="text.secondary">Matures In: </Typography>
                                            <Box p={1}>
                                                <Typography gutterBottom variant="body2">120days 10h. 11m. 2s.</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <Grid container spacing={2} mt={0} justifyContent="center">
                                    <Grid item>
                                        <Button size="medium" sx={{ m: 1 }} variant="contained" color="primary">Buy</Button>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Card>


                    </Grid>
                                     
                </Grid>
            </Box>
            <Box m={2}>
                <Typography variant="h6">Buy this Contract?</Typography>
                <Grid container spacing={2}>              
                    {/* Opthy card loop  */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ m: 1, borderRadius: '10px' }}>
                            <Box className={classes.boxHeader} sx={{backgroundColor: 'success.dark'}}></Box>
                            <CardContent sx={{padding: '0px 0px 0px 155px'}}>
                                <Grid container spacing={2} mt={0}>
                                    <Grid item xs={12}>
                                        <Typography m={1}> From </Typography>
                                        <FormControl sx={{ m: 1, width: 350 }}>
                                            <InputLabel id="demo-controlled-open-select-label">DAI</InputLabel>
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
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>DAI</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography m={1} sx={{display: 'inline-block'}}>Quantity: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                            <Typography sx={{display: 'inline-block'}} gutterBottom variant="body2">~ $670,000.00 USD</Typography>
                                        </Box>
                                        <FormControl sx={{ m: 1, width: 350 }}>
                                            <InputLabel id="demo-controlled-open-select-label">DAI</InputLabel>
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
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>DAI</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Box m={1}>
                                    <Typography gutterBottom variant="body2">Use Max 1000,000.00 DAI limited by wallet balance</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ m: 1, borderRadius: '10px', minHeight: 325 }}>
                            <CardContent sx={{padding: '0px 0px 0px 155px'}}>
                                <Grid container spacing={2} mt={0}>
                                    <Grid item xs={12}>
                                        <Typography m={1}> To </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography m={1} sx={{display: 'inline-block'}}>Quantity: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                            <Typography sx={{display: 'inline-block'}} gutterBottom variant="body2">~ $670,000.00 USD</Typography>
                                        </Box>
                                        <FormControl sx={{ m: 1, width: 350 }}>
                                            <InputLabel id="demo-controlled-open-select-label">DAI</InputLabel>
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
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>DAI</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
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
                                <Typography m={1} variant="body2"> Contract balance after: 60,000.00 DAI / 9000000000 BTC </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                                       
                </Grid>
                
            </Box>
            <Box m={2} mt={-1}>
                <Grid container justifyContent="center">
                    <Grid item>
                        <Button size="medium" variant="contained" color="primary">Approve DAI to Buy</Button>
                    </Grid>
                </Grid>
            </Box>
        </Page>
    )
}

export default Contract;

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