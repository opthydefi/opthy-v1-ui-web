import React, { FC } from "react";
import { TestComponents } from 'src/TestComponents';
import Page from 'src/components/Page';
// import { BuyContractComponent } from 'src/BuyContractComponent';
import { Grid, Box, Typography } from '@mui/material';
import { OpthyCard } from "src/components/Card";
import useSWR from 'swr';
import { BigNumber, ethers } from 'ethers';
import { name2ABI } from "src/utils/helpers";
import { ChainId, ERC20, OpthyABI, Opthys, OpthysView } from 'opthy-v1-core';
// import { OPTHY_NETWORKS } from "src/utils/constants";




declare const window: any;

const Home: FC = () => {
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
            <Box m={2}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h2">Buy on Opthy</Typography>
                        <Typography variant="body2">Buy = Get:Fixed Swap Rate + Liquidity + Unlimited Swaps</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box m={2}>
                <Grid container spacing={0}>
                    {/* Opthy card loop  */}
                    <OpthyCard data={{ title: "test" }} />
                    {/* Opthy card loop  */}
                </Grid>
            </Box>
        </Page>
    )
}

export default Home;