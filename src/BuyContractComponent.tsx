import React from "react";
import type { FC } from "react"
import { Box, Grid, Typography, Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Page from './components/Page';
import Card from './components/Card';


export const BuyContractComponent: FC = () => {
    const sendData = [0,1,2,3,4,5];
    return (
        <Page title="Buy Contract">
            <h2>Buy on Opthy</h2>
            <p>Buy = Get:Fixed Swap Rate + Liquidity + Unlimited Swaps</p>
            <Card data={sendData} />
        </Page>
    )
}