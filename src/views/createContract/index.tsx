import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, CardActions, Container, FormControl, InputLabel, Select, MenuItem, Button, Paper, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { OpthyCard } from "src/components/Card";
import makeStyles from '@mui/styles/makeStyles';
import Divider from '@mui/material/Divider';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

const useStyles = makeStyles((theme: Theme) => ({
    customContainer: {       
        minWidth: '70%'        
    },
    boxHeader: {
        height: '8px'
    },
    boxHeader2: {
        height: '40px'
    },
    paperTransparent:{
        backgroundColor: "transparent !important" ,
    },
    customProgress:{
        "& .MuiLinearProgress-bar": {
            borderRadius: "5px 0px 0px 5px !important",           
            borderRight: "3px solid" + theme.palette.background.default,
        },
    },
}));


const CreateContract: FC = () => {
    const classes = useStyles();
    const [dai, setDai] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [values, setValues] = React.useState({
        weight: '',
      });
    
      const handleChange2 = (prop: string) => (event: { target: { value: any; }; }) => {
        setValues({ ...values, [prop]: event.target.value });
      };

    const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setDai(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <Page title="Create Contract">
            <Box m={2} mt={10}>
                <Grid container spacing={2}>
                    <Grid item xs={12} m={1}>
                        <Typography variant="h4">Create Contract</Typography>
                        <Typography>Liquidity at your own terms</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Container className={classes.customContainer}>
                <Box m={1} textAlign='center'>
                    <Typography align="center">Do you want to request liquidity or provide liquidity? </Typography>
                </Box>
                
                <Box m={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel value="male" control={<Radio />} label="I'm charging a fee to providing liquidity" />
                            <Typography m={1}> Liquidity Provider </Typography>
                            <FormControl sx={{ m: 1, width: '50ch' }}>
                                <InputLabel id="demo-controlled-open-select-label">BTC</InputLabel>
                                <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={dai}
                                label="DAI"
                                onChange={handleChange}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>DAI</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography m={1}> Fixed Swap Rate </Typography>
                            <FormControl sx={{ m: 1, width: '50ch' }}>
                                <InputLabel id="demo-controlled-open-select-label">BTC</InputLabel>
                                <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={dai}
                                label="DAI"
                                onChange={handleChange}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>DAI</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel value="male" control={<Radio />} label="I'm charging a fee to providing liquidity" />
                            <Typography m={1}> Swappable Asset </Typography>
                            <FormControl sx={{ m: 1, width: '53ch' }}>
                                <InputLabel id="demo-controlled-open-select-label">DAI</InputLabel>
                                <Select
                                labelId="demo-controlled-open-select-label"
                                id="demo-controlled-open-select"
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                value={dai}
                                label="DAI"
                                onChange={handleChange}
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>DAI</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography m={1}> Duration </Typography>
                            <FormControl sx={{ m: 1, width: '12ch' }} variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                value={values.weight}
                                onChange={handleChange2('weight')}
                                endAdornment={<InputAdornment position="end">DDD</InputAdornment>}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                'aria-label': 'weight',
                                }}
                            />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '12ch' }} variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                value={values.weight}
                                onChange={handleChange2('weight')}
                                endAdornment={<InputAdornment position="end">HHH</InputAdornment>}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                'aria-label': 'weight',
                                }}
                            />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '12ch' }} variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                value={values.weight}
                                onChange={handleChange2('weight')}
                                endAdornment={<InputAdornment position="end">MMM</InputAdornment>}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                'aria-label': 'weight',
                                }}
                            />
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '12ch' }} variant="outlined">
                            <OutlinedInput
                                id="outlined-adornment-weight"
                                value={values.weight}
                                onChange={handleChange2('weight')}
                                endAdornment={<InputAdornment position="end">SSS</InputAdornment>}
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                'aria-label': 'weight',
                                }}
                            />
                            </FormControl>
                        </Grid> 
                    </Grid>
                </Box>
            
                {/* <Box m={2}>
                    <Grid container spacing={2}> 
                        <Grid item xs={12} md={4}>
                            
                        </Grid>
                        <Grid item xs={12} md={4}>
                            
                        </Grid>        
                    </Grid>
                </Box> */}
            
            </Container>
        </Page>
    )
}

export default CreateContract;