import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, Container } from '@mui/material';
import { OpthyCard } from "src/components/Card";
import makeStyles from '@mui/styles/makeStyles';
import useSWR from 'swr';
import { BigNumber, ethers } from 'ethers';
import { name2ABI } from "src/utils/helpers";
import { ChainId, ERC20, OpthyABI, Opthys, OpthysView } from 'opthy-v1-core';
// import { OPTHY_NETWORKS } from "src/utils/constants";

const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {       
        minWidth: '100%'        
    }
}));


declare const window: any;

const Home: FC = () => {
    const classes = useStyles();
    let { ethereum } = window;
    let AllOpthys = OpthysView(ChainId.RinkebyTestnet);
    // // console.log(AllOpthys, 'AllOpthys');
    // // const provider = new ethers.providers.Web3Provider(ethereum);
    // // let address = opthysAddress(ChainId.RinkebyTestnet);
    const { data: opthys, mutate, isValidating } = useSWR([AllOpthys.ABI, AllOpthys.address, "all"]);
    console.log(opthys, isValidating, 'isValidating')


    let OnlyOpthys = Opthys(ChainId.RinkebyTestnet);
    // console.log(OnlyOpthys, 'OnlyOpthys');
    // const { data: opthysNew, mutate, isValidating  } = useSWR([OnlyOpthys.ABI, OnlyOpthys.address, "createNewOpthy"]);
    // console.log(opthysNew, 'opthysNew');

    var date = new Date();
    const sendData = {
        iProvideLiquidy_: true,
        feeAmountT0_: "1000000000000000000",
        expiration_: Math.round(date.setDate(date.getDate() + 7))/1000,
        token0_: "0x7af456bf0065aadab2e6bec6dad3731899550b84",
        token1_: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        rT0_: "10000000000000000000",
        rT1_: "3333333333333333",
        fundingAmountT0_: "10000000000000000000"
    };
    // const { data: createOpthy, mutate, isValidating  } = useSWR([OnlyOpthys.ABI, OnlyOpthys.address, "createNewOpthy", true, "1000000000000000000", Math.round(date.setDate(date.getDate() + 7))/1000, "0x7af456bf0065aadab2e6bec6dad3731899550b84", "0xc778417E063141139Fce010982780140Aa0cD5Ab", "10000000000000000000", "3333333333333333", "10000000000000000000"]);

    // const { data: createOpthy, mutate, isValidating  } = useSWR([OnlyOpthys.ABI, OnlyOpthys.address, "createNewOpthy", sendData]);
    // console.log(createOpthy, "createOpthy");






    React.useEffect(() => {
        // mutate(opthys, true);
        // mutate(sendData, true);
    }, []);

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
                    <Grid item xs={12} md={4}>
                         <OpthyCard data={{ title: "First Test" }} />
                    </Grid>  
                    <Grid item xs={12} md={4}>
                        <OpthyCard data={{ title: "Second Test" }} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <OpthyCard data={{ title: "Third Test" }} />
                    </Grid>                 
                    {/* Opthy card loop  */}                   
                </Grid>
            </Box>
            </Container>
        </Page>
    )
}

export default Home;