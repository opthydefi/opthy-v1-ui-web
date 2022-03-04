import React, { FC } from "react";
import { TestComponents } from 'src/TestComponents';
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
// import { BuyContractComponent } from 'src/BuyContractComponent';
import { Grid, Box, Typography, Container } from '@mui/material';
import { OpthyCard } from "src/components/Card";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {       
        minWidth: '100%'        
    }
}));


const Home: FC = () => {
    // const getData = [{title: }]
    const classes = useStyles();
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