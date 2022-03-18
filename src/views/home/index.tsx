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
import { parseUnits } from '@ethersproject/units';



declare const window: any;

const Home: FC = () => {
    let { ethereum } = window;
    let opthy = Opthys(ChainId.RinkebyTestnet);

    // const { data, error, isValidating, mutate } = useSWR(url, fetcher, {
    //     fetchOptions
    //     })

    const fetcher = async (...args: any) => {

        // console.log(args, "args");
        const [contract, method, ...params] = args;
        let parameter = params.toString();
        return await contract[method](...params);
        // console.log(contract[method](...params));
        // console.log(parameter, 'parameter')
        // const data = await contract[method](...params);
        // console.log(data, 'data');
        // return data;
        // console.log(contract, method, ...params);

    }


    var date = new Date();
    let params = [
        true, //we are providing liquidity
        "1000000000000000000", // how much DAI the buyer will have to pay to purchase this contract
        Math.round(date.setDate(date.getDate() + 7)) / 1000, //The contract expires 7 days from now! (It's expressed in seconds since Epoch)
        "0x7af456bf0065aadab2e6bec6dad3731899550b84", //DAI is token0
        "0xc778417E063141139Fce010982780140Aa0cD5Ab", //WETH is token1
        "10000000000000000000", //max amount of DAI in the contract
        "3333333333333333", //max amount of WETH in the contract
        "10000000000000000000" //what we are providing of DAI/token0 right now to create the contract
    ];

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();




    // 0xc778417E063141139Fce010982780140Aa0cD5Ab -- ok
    // 0x7af456bf0065aadab2e6bec6dad3731899550b84
    // 0x265566d4365d80152515e800ca39424300374a83
    // 0x74a3dbd5831f45cd0f3002bb87a59b7c15b1b5e6
    const createOpthy = async (): Promise<void> => {
        let token_1 = await signer.getAddress();
        // console.log(token_0);
        const contract = new ethers.Contract(opthy.address, opthy.ABI, signer);
        const transaction = await contract.createNewOpthy(
            true, //we are providing liquidity
            BigInt(1), // how much DAI the buyer will have to pay to purchase this contract
            11111111111111, //The contract expires 7 days from now! (It's expressed in seconds since Epoch)
            '0x7af456bf0065aadab2e6bec6dad3731899550b84', //DAI is token0
            token_1, //WETH is token1
            BigInt(3), //max amount of DAI in the contract
            BigInt(3), //max amount of WETH in the contract
            BigInt(3) //what we are providing of DAI/token0 right now to create the contract
        );
        console.log(transaction, 'transaction');
        await transaction.wait();

    }






    const getOtpthys = async () => {
        let AllOpthys = OpthysView(ChainId.RinkebyTestnet);
        const contract = new ethers.Contract(AllOpthys.address, AllOpthys.ABI, signer);
        console.log(contract, AllOpthys, 'c')
        try {
            const data = await contract.all()
            console.log('data: ', data)
        } catch (err) {
            console.log("Error: ", err)
        }
    }
    let AllOpthys = OpthysView(ChainId.RinkebyTestnet);
    const contract = new ethers.Contract(AllOpthys.address, AllOpthys.ABI, signer);

    const { data, mutate, isValidating } = useSWR([contract, "all"], fetcher, { refreshInterval: 0, revalidateOnMount: false, revalidateOnFocus: false });
    console.log(data, isValidating, 'anyValue')



    // console.log(AllOpthys, 'AllOpthys')
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // let address = opthysAddress(ChainId.RinkebyTestnet);
    // const { data: opthys, mutate, isValidating } = useSWR([AllOpthys.ABI, AllOpthys.address, "all"]);
    // console.log(opthys, isValidating, 'isValidating')
    let signerAddress = async () => {
        let token_0 = await signer.getAddress();
        console.log(token_0);
    }

    React.useEffect(() => {
        signerAddress();
        // createOpthy();
        getOtpthys();
        // mutate(undefined, true);
    }, []);

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