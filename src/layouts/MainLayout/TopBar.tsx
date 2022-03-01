import React from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { AppBar, Box, Button, Divider, Toolbar, Hidden, Typography, Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
// import Logo from 'src/components/Logo';
import type { Theme } from "src/types/theme";
import { useEthersState } from 'src/contexts/EthereumContext';

// import Register from 'src/components/modals/Register';


interface TopBarProps {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main
  },
  toolbar: {
    height: 64
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
  }
}));

const TopBar: FC<TopBarProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { connectWallet } = useEthersState();

  let history = useHistory();
  const [openRegisterButton, setOpenRegisterButton] = React.useState(false);
  const handleClickOpenRegister = () => {
    setOpenRegisterButton(true);
  };
  const handleCloseRegister = () => {
    setOpenRegisterButton(false);
  };

  const goToRegister = (user_type = "") => {
    if (user_type) {
      history.push(`register/${user_type}`);
    }
  };


  return (
    <AppBar
      className={clsx(classes.root, className)}
      color="default"
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/">
          <Typography>Logo</Typography>
        </RouterLink>
        <Box flexGrow={1} />
        <Button
          color='primary'
          variant='outlined'
          onClick={connectWallet}
        >
          Login
        </Button>
      </Toolbar>

    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
