import React, { FC } from "react";
import { TestComponents } from 'src/TestComponents';
import Page from 'src/components/Page';
// import { BuyContractComponent } from 'src/BuyContractComponent';
import { Grid, Box, Typography } from '@mui/material';
import { OpthyCard } from "src/components/Card";




const Home: FC = () => {
    // const getData = [{title: }]
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
                    <OpthyCard data={{ title: "First Test" }} />
                    <OpthyCard data={{ title: "Second Test" }} />
                    {/* Opthy card loop  */}
                </Grid>
            </Box>
        </Page>
    )
}

export default Home;