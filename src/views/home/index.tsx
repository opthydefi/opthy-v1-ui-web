import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, Container, Button } from '@mui/material';
import { useEthersState } from 'src/contexts/EthereumContext';
import { OpthyCard } from "src/components/Card";
import makeStyles from '@mui/styles/makeStyles';
import useSWR from 'swr';
import { BigNumber, ethers } from 'ethers';
import { name2ABI } from "src/utils/helpers";
import { ChainId, ERC20, OpthyABI, Opthys, OpthysView } from 'opthy-v1-core';
import { TransactionReceipt, TransactionResponse } from "@ethersproject/providers";
// import { OPTHY_NETWORKS } from "src/utils/constants";
// import { formatUnits, parseUnits } from '@ethersproject/units';

const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {  
        minWidth: '100%'
    },
    loadingClass: {
        marginTop: '10% !important',
        textAlign: 'center'
    }
}));


declare const window: any;

const Home: FC = () => {
    const { userCurrentAddress, connectWallet } = useEthersState();
    const classes = useStyles();
    let { ethereum } = window;
    // console.log("userCurrentAddress = ",isMetamaskInstall, userCurrentAddress);
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    let AllOpthys = OpthysView(ChainId.RinkebyTestnet);
    // console.log("AllOpthys = ", AllOpthys);

    let OnlyOpthys = Opthys(ChainId.RinkebyTestnet);
    // console.log("OnlyOpthys = ", OnlyOpthys);

    let MyOpthys = OpthyABI(ChainId.RinkebyTestnet);
    console.log("MyOpthys = ", MyOpthys);

    const { data: opthys, mutate: opthyMutate, isValidating } = useSWR([AllOpthys.ABI, AllOpthys.address, "all"]);
    // console.log(opthys, isValidating, 'isValidating');

    // const myContract = new ethers.Contract(userCurrentAddress);
    // console.log("provider = ", provider, signer);
    // myContract.myEvent({}, { fromBlock: 0, toBlock: 'latest' }).get((error: string, eventResult: { args: any; }) => {
    //     if (error)
    //       console.log('Error in myEvent event handler: ' + error);
    //     else
    //       console.log('myEvent: ' + JSON.stringify(eventResult.args));
    //   });
    // const ourData = myContract.getPastEvents('MyEvent');


    const createOpthy = async (): Promise<void> => {
        let date = new Date();
        const contract = new ethers.Contract(OnlyOpthys.address, OnlyOpthys.ABI, signer);
        const transaction = await contract.createNewOpthy(
            true, //we are providing liquidity
            "1000000000000000000", // how much DAI the buyer will have to pay to purchase this contract
            Math.round(Math.round(date.setDate(date.getDate() + 7)) / 1000), // 10000000000, //The contract expires 7 days from now! (It's expressed in seconds since Epoch)
            "0x7af456bf0065aadab2e6bec6dad3731899550b84", //DAI is token0
            "0xc778417E063141139Fce010982780140Aa0cD5Ab", //WETH is token1
            "10000000000000000000", //max amount of DAI in the contract
            "2222222222222222", //max amount of WETH in the contract 3333333333333333
            "10000000000000000000" //what we are providing of DAI/token0
        );

        await transaction.wait();
        await opthyMutate(opthys, true);
    }

    const setLiquidityProviderFee = async (): Promise<void> => {
        const contract = new ethers.Contract("0x1Da9c71671f292819aE4680DA58d0a410BD1a009", MyOpthys, signer);
        const txResponse: TransactionResponse = await contract.setLiquidityProviderFee(
            "0x7Af456bf0065aADAB2E6BEc6DaD3731899550b84",
            "10000000000000000000"
        );
        console.log("setLiquidityProviderFee Transaction Response = ", txResponse);
        const txReceipt: TransactionReceipt = await txResponse.wait();
        console.log("txReceipt = ", txReceipt)
        console.log("txReceipt log = ", txReceipt.logs[0])
    }
    React.useEffect(() => {
        // setLiquidityProviderFee();
        // createOpthy()
        // opthyMutate(opthys, true);
        // opthyMutate(sendData, true);
    }, []);

    if(isValidating === true){
        return <Typography className={classes.loadingClass} gutterBottom variant="h5" component="div">Loading...</Typography>
    }
    return (
        <Page title="Home page">
            <Container className={classes.customContainer}>
                { userCurrentAddress === "" ?
                <Box m={2} mt={20} textAlign='center'>
                    <Button
                        color='primary'
                        variant='outlined'
                        onClick={connectWallet}
                        >
                        Please Login
                    </Button>
                </Box>
                : <>
                <Box m={2} mt={10}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} m={1}>
                            <Typography variant="h2">Buy on Opthy</Typography>
                            <Typography variant="body2">Buy = Get:Fixed Swap Rate + Liquidity + Unlimited Swaps</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box m={2}>
                    <Grid container spacing={2}>
                        {/* Opthy card loop  */}
                        { opthys?.length > 0 ?
                        opthys.map((opthyData: any, index: any) => {
                            // console.log("opthyData = ", opthyData, "index = ", index);
                            const now = Math.floor(Date.now() / 1000);
                            const expire = parseInt(opthyData.expiration._hex);
                            if(expire > now){
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        <OpthyCard data={opthyData} calledFrom="home" />
                                    </Grid> 
                                )
                            }
                        }): "" }
                        {/* Opthy card loop  */}                   
                    </Grid>
                </Box>
                </> 
                }
            </Container>
        </Page>
    )
}

export default Home;