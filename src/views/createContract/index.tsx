import React, { FC } from "react";
import Page from 'src/components/Page';
import type { Theme } from 'src/types/theme';
import { Grid, Box, Typography, Divider, Container, FormControl, InputLabel, Select, MenuItem, Button, Radio, FormControlLabel, OutlinedInput, InputAdornment, RadioGroup } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
// import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

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
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="liquidityType"
                            >
                                <FormControlLabel value="charge" control={<Radio />} label="I'm charging a fee to providing liquidity" />
                            </RadioGroup>
                            <Typography m={1}> Liquidity Provider </Typography>
                            <FormControl sx={{ m: 1, width: '50ch' }}>
                                <InputLabel id="chrage-label">BTC</InputLabel>
                                <Select
                                labelId="chrage-label"
                                id="chrage"
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
                            <Box m={1} mt={6}>
                                <Typography style={{display: 'inline-block'}}> Fixed Swap Rate </Typography>
                                <Typography style={{display: 'inline-block', marginLeft: '43%', marginBottom: "0px"}} gutterBottom variant="body2" color="text.secondary">Toggle Order</Typography>
                                <Typography style={{display: 'inline-block', marginLeft: '61%'}} variant="caption" color="text.secondary">1 BTC = 60K DAI</Typography>
                            </Box>
                            <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                                <OutlinedInput
                                    id="outlined-adornment-weight"
                                    value={values.weight}
                                    onChange={handleChange2('weight')}
                                    endAdornment={<InputAdornment position="end">BTC = 1DAI</InputAdornment>}
                                    aria-describedby="outlined-weight-helper-text"
                                    inputProps={{
                                    'aria-label': 'weight',
                                    }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="liquidityType"
                            >
                                <FormControlLabel value="pay" control={<Radio />} label="I'm paying a fee to providing liquidity" />
                            </RadioGroup>
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
                            <Typography m={1} mt={6}> Duration </Typography>
                            <Typography>&nbsp;</Typography>
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
                        
                        <Grid item xs={12} md={12}>
                            <Box display="flex">
                                <Typography style={{display: 'inline-block', marginLeft: "30%"}}> Fee </Typography>
                                <Typography style={{display: 'inline-block', marginLeft: '25%', marginBottom: "0px"}} gutterBottom variant="body2" color="text.secondary">~$141,444.44 USD</Typography>
                            </Box>
                            <Box display="flex"
                            alignItems="center"
                            justifyContent="center">
                                <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                                    <OutlinedInput
                                        id="outlined-adornment-weight"
                                        value={values.weight}
                                        onChange={handleChange2('weight')}
                                        endAdornment={<InputAdornment position="end">BTC</InputAdornment>}
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                        'aria-label': 'weight',
                                        }}
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{marginTop: "30px"}} />
                    <Grid container spacing={2} mt={0} justifyContent="center">
                        <Grid item>
                            <Button sx={{ m: 1, width: '25ch' }} variant="contained" color="primary">Create</Button>
                        </Grid>
                    </Grid>
                </Box>
            
            </Container>
        </Page>
    )
}

export default CreateContract;