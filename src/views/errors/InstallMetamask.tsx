
import React, { FC } from "react";
import Page from "src/components/Page";
import { Typography } from "@mui/material";



const InstallMetamask: FC = () => {
    return (
        <Page>
            <Typography sx={{ textAlign: 'center' }} variant="h2" color="error.main">install metamask extension info page</Typography>
        </Page>
    )
}

export default InstallMetamask;