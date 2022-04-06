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

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

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
}));


const BuyContract: FC = () => {
    const classes = useStyles();
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
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                        <Typography variant="h6">Buy this Contract?</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>             
                    {/* Opthy card loop  */}
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
                                    <Typography align="center" variant="h5">Pay 2.00 BTC</Typography>
                                    <Typography align="center">to become the Swapper</Typography>

                                    <Button size="medium" sx={{ m: 3 }} variant="contained" color="primary">Approve BTC to Buy</Button>
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
                                    <Typography align="center" variant="h5">The Liquidity Provider Role</Typography>
                                    <Typography align="center">is not on offer</Typography>
                                    {/* <Typography align="center" variant="h5">Pay 2.00 BTC</Typography>
                                    <Typography align="center">to become the Liquidity Provider</Typography>
                                    <Button size="medium" sx={{ m: 3 }} variant="contained" color="primary">Approve BTC to Buy</Button> */}
                                </Box>
                                <Box m={5}>
                                    <Divider />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>                 
                    {/* Opthy card loop  */}                   
                </Grid>
            </Box>
            <Box m={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                        <Typography variant="h6">Contract History</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                    <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
                    {/* {[1, 2, 3].map((value) => ( */}
                        <ListItem
                        key={1}
                        >
                            <ListItemText sx={{ width: 100 }} primary={`2022-05-04`} />
                            <ListItemText sx={{ width: 100 }} primary={`17:46`} />
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
                            }} primary={`Contract bought by: 45ab5471485cfaadeccabdef25631aef`} />
                        </ListItem>
                        <ListItem
                        key={2}
                        >
                            <ListItemText sx={{ width: 100 }} primary={`2022-05-04`} />
                            <ListItemText sx={{ width: 100 }} primary={`17:46`} />
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
                            }} primary={`Contract created by you as a seller`} />
                        </ListItem>
                        
                    {/* ))} */}
                    </List>
                    </Grid>
                </Grid>
            </Box>
        </Page>
    )
}

export default BuyContract;