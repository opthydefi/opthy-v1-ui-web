import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // useHistory
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AppBar, Box, Button, Toolbar, Typography, Link, Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Logo from '../../images/bi_graph-up.svg';
import type { Theme } from "src/types/theme";
import { useEthersState } from 'src/contexts/EthereumContext';
import PersonIcon from '@mui/icons-material/Person';
// import Register from 'src/components/modals/Register';


interface TopBarProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main
  },
  toolbar: {
    height: 64,
  },
  logo: {
    marginRight: theme.spacing(2)
  },
  link: {
    fontWeight: theme.typography.fontWeightMedium,
    '& + &': {
      marginLeft: theme.spacing(2)
    }
  },
  divider: {
    width: 1,
    height: 32,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  customContainer: {       
    minWidth: '100%'        
  },
  customMenu: {
    display: 'flex',
    padding: '15px 24px 15px',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.palette.primary.main}`,
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    margin: '0 0 24px',   
  }
  
}));

const TopBar: FC<TopBarProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { connectWallet, userCurrentAddress, isMetamaskInstall } = useEthersState();
  // console.log("loggedIN userCurrentAddress = ",isMetamaskInstall, userCurrentAddress);

  // let history = useHistory();
  // const [openRegisterButton, setOpenRegisterButton] = React.useState(false);
  // const handleClickOpenRegister = () => {
  //   setOpenRegisterButton(true);
  // };
  // const handleCloseRegister = () => {
  //   setOpenRegisterButton(false);
  // };

  // const goToRegister = (user_type = "") => {
  //   if (user_type) {
  //     history.push(`register/${user_type}`);
  //   }
  // };


  return (
    <AppBar
      className={clsx(classes.root, className)}
      color="default"
      {...rest}
    >
      <Container className={classes.customContainer}>
        <Toolbar className={classes.toolbar}>
          <RouterLink to="/">
          <img src={Logo} alt="logo" />
            <Typography sx={{display: 'inline-block'}}> Opthy</Typography>
          </RouterLink>
          <Box flexGrow={1} />
          {isMetamaskInstall === true && userCurrentAddress !== '' && (
            <>
              <Button variant="outlined" startIcon={<PersonIcon />}>
                Logged In
              </Button>
            </>
          )}
          {isMetamaskInstall === true && userCurrentAddress === '' && (
            <Button
              color='primary'
              variant='outlined'
              onClick={connectWallet}
            >
              Login
            </Button>
          )}

        </Toolbar>
        <Box className={classes.customMenu}>
          <RouterLink to="" style={{textDecoration: 'none'}}>
            Buy Contracts
          </RouterLink>
          <Link href="#" underline="none">
            Sell Contracts
          </Link>
          {/* <Link href="/create-contract" underline="none">
          Create Contract
          </Link> */}
          <RouterLink to="create-contract">
            Create Contract
          </RouterLink>
          <Link href="#" underline="none">
            Edit Buy Contract Offers
          </Link>
          <Link href="#" underline="none">
            Edit  Sell Contract Offers
          </Link>
          <Link href="#" underline="none">
            Bought Contracts
          </Link>
          <Link href="#" underline="none">
            Sold Contracts
          </Link>
          <Link href="#" underline="none">
            About us
          </Link>               
        </Box>
      </Container>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
