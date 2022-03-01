import React from "react";
import type { FC } from "react"
import { Box, Grid, Typography, Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Page from './components/Page';






export const TestComponents: FC = () => {


    return (
        <Page title="test">
            <Box alignItems="center"
                justifyContent="center">
                <Grid container spacing={2} >

                    <Grid item xs={12}>
                        <Typography
                            variant="h2"
                        >H2 </Typography>
                        <Typography
                            variant="h2"
                            color={'primary.main'}
                        >H2 primary.main</Typography>
                        <Typography
                            variant="h2"
                            color={'secondary.main'}
                        >H2 secondary.main</Typography>
                        <Typography
                            variant="h2"
                            color={'success.main'}
                        >H2 success</Typography>
                        <Typography
                            variant="h2"
                            color={'info.main'}
                        >H2 info.main</Typography>
                        <Typography
                            variant="h2"
                            color={'error.main'}
                        >H2 error.main</Typography>
                        <Typography
                            variant="h2"
                            color={'warning.main'}
                        >H2 warning.main</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} >

                    <Grid item xs={12}>
                        {/* "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" */}
                        <Button sx={{ m: 2 }} variant="contained" color="primary">primary</Button>
                        <Button size="large" sx={{ m: 2 }} variant="contained" color="secondary">secondary large button text</Button>
                        <Button size="small" sx={{ m: 2 }} variant="contained" color="success">success</Button>
                        <Button size="medium" sx={{ m: 2 }} variant="contained" color="error">error</Button>
                        <Button sx={{ m: 2 }} variant="contained" color="info">info</Button>
                        <Button sx={{ m: 2 }} variant="contained" color="warning">warning</Button>

                        <Button sx={{ m: 2 }} variant="outlined" color="primary">primary</Button>
                        <Button sx={{ m: 2 }} variant="outlined" color="secondary">secondary</Button>
                        <Button sx={{ m: 2 }} variant="outlined" color="success">success</Button>
                        <Button sx={{ m: 2 }} variant="outlined" color="error">error</Button>
                        <Button sx={{ m: 2 }} variant="outlined" color="info">info</Button>
                        <Button sx={{ m: 2 }} variant="outlined" color="warning">warning</Button>
                    </Grid>
                </Grid>
            </Box>
        </Page>
    )
}