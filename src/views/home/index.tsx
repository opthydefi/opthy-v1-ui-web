import React, { FC } from "react";
import { TestComponents } from 'src/TestComponents';
import Page from 'src/components/Page';
// import { BuyContractComponent } from 'src/BuyContractComponent';
import { Grid, Box, Typography } from '@mui/material';
import { OpthyCard } from "src/components/Card";
import useSWR from 'swr';
import { BigNumber, ethers } from 'ethers';
import { name2ABI } from "src/utils/helpers";



declare const window: any;

const Home: FC = () => {

    const { data: balance, mutate } = useSWR(['getBalance', '0x9d23e5D38C31DF9FF11512e40f43a2a4Fa7a3b41', 'latest'])
    console.log(balance, 'balance')

    // mutate(new BigNumber(10, balance._hex), false)

    React.useEffect(() => {
        mutate('', true);
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