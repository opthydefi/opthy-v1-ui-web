import React from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import TopBar from './TopBar';
import { Theme } from './../../types/theme';
// import { useChangeTheme } from 'src/contexts/ThemeContext';
// import { getCookie } from 'src/utils/helpers';
// import { useMediaQuery } from '@mui/material';


interface MainLayoutProps {
  children?: ReactNode;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden'
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  }
}));

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const classes = useStyles();

  // const changeTheme = useChangeTheme();
  // const [mode, setMode] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const initialMode = getCookie('paletteMode') || 'dark';
  //   console.log('initialMode', initialMode)
  //   setMode(initialMode);
  //   document.cookie = `paletteMode=${initialMode};path=/;max-age=31536000`;
  //   changeTheme({
  //     dense: true,
  //     direction: 'ltr',
  //     paletteColors: {},
  //     spacing: 8,
  //     paletteMode: initialMode
  //   });
  // }, []);

  return (
    <div className={classes.root}>
      <TopBar />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
