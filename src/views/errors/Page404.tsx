
import React, { FC } from "react";
import Page from "src/components/Page";
import { Typography } from "@mui/material";



const Page404: FC = () => {
    return (
        <Page>
            <Typography sx={{ textAlign: 'center' }} variant="h2" color="error.main">404 page</Typography>
        </Page>
    )
}

export default Page404;