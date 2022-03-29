import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, Container } from '@mui/material';
import { OpthyCard } from "src/components/Card";
import makeStyles from '@mui/styles/makeStyles';
import useSWR from 'swr';
import useSWRImmutable from 'swr';
import { BigNumber, ethers } from 'ethers';
import { name2ABI } from "src/utils/helpers";
import { ChainId, ERC20, OpthyABI, Opthys, OpthysView } from 'opthy-v1-core';
// import { OPTHY_NETWORKS } from "src/utils/constants";
import { formatUnits, parseUnits } from '@ethersproject/units';

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
    const classes = useStyles();
    let { ethereum } = window;

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    let AllOpthys = OpthysView(ChainId.RinkebyTestnet);
    // console.log("AllOpthys = ", AllOpthys)
    let OnlyOpthys = Opthys(ChainId.RinkebyTestnet);

    const { data: opthys, mutate, isValidating } = useSWR([AllOpthys.ABI, AllOpthys.address, "all"]);
    console.log(opthys, isValidating, 'isValidating');
    // console.log("opthyData = ", formatUnits(opthys[6].token0.balance, opthys[6].token0.decimals));


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
        await mutate(opthys, true);
    }
    React.useEffect(() => {
        // createOpthy()
        // mutate(opthys, true);
        // mutate(sendData, true);
    }, []);






    if(isValidating === true){
        return <Typography className={classes.loadingClass} gutterBottom variant="h5" component="div">Loading...</Typography>
    }
    return (
        <Page title="Home page">
            <Container className={classes.customContainer}>
            
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
                    { opthys && opthys.length > 0 ?
                    opthys.map((opthyData: any, index: any) => {
                        if(index === 6) {
                            // formatUnits(opthyData.token0.balance, opthyData.token0.decimals)
                            console.log("opthyData = ", formatUnits(opthyData.balanceT1));
                        }
                        return (
                            <Grid item xs={12} md={4} key={index}>
                                <OpthyCard data={opthyData} />
                            </Grid> 
                        )
                    }): "" }
                    {/* Opthy card loop  */}                   
                </Grid>
            </Box>
            </Container>
        </Page>
    )
}

export default Home;