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
import { parseUnits } from '@ethersproject/units';



declare const window: any;

const Home: FC = () => {
    let { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    let opthy = Opthys(ChainId.RinkebyTestnet);
    let AllOpthys = OpthysView(ChainId.RinkebyTestnet);

    const { data: opthys, mutate: getAllOpthy, isValidating } = useSWR([AllOpthys.ABI, AllOpthys.address, "all"]);
    console.log(opthys, isValidating, 'isValidating');


    const createOpthy = async (): Promise<void> => {

        var date = new Date();

        const contract = new ethers.Contract(opthy.address, opthy.ABI, signer);
        const transaction = await contract.createNewOpthy(
            true, //we are providing liquidity
            "1000000000000000000", // how much DAI the buyer will have to pay to purchase this contract
            Math.round(Math.round(date.setDate(date.getDate() + 7)) / 1000), // 10000000000, //The contract expires 7 days from now! (It's expressed in seconds since Epoch)
            "0x7af456bf0065aadab2e6bec6dad3731899550b84", //DAI is token0
            "0xc778417E063141139Fce010982780140Aa0cD5Ab", //WETH is token1
            "10000000000000000000", //max amount of DAI in the contract
            "3333333333333333", //max amount of WETH in the contract
            "10000000000000000000" //what we are providing of DAI/token0
        );

        await transaction.wait();
        await getAllOpthy(opthys, true);

    }


    // React.useEffect(() => {
    //     // signerAddress();
    //     // createOpthy();
    //     // getOtpthys();
    //     // mutate(undefined, true);
    // }, []);

    return (
        <Page title="Home page">
            <Box m={2}>
                <Grid container spacing={2}>
                    <button onClick={createOpthy}>createOpthy</button>
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