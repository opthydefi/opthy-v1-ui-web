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
    // console.log(AllOpthys, 'AllOpthys')
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // let address = opthysAddress(ChainId.RinkebyTestnet);
    const { data: opthys, mutate, isValidating } = useSWR([AllOpthys.ABI, AllOpthys.address, "all"]);
    console.log(opthys, isValidating, 'isValidating')


    React.useEffect(() => {
        // mutate(opthys, true);
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