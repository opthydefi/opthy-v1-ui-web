import React, {
  forwardRef,
  useEffect,
  useCallback
} from 'react';
import type {
  HTMLProps,
  ReactNode
} from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import type { Theme } from 'src/types/theme';
import makeStyles from '@mui/styles/makeStyles';
// import track from 'src/utils/analytics';


const useStyles = makeStyles((theme: Theme) => {
  console.log(theme, 'theme');
  return {
    root: {
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    },
  }
})

interface PageProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({
  children,
  title = '',
  ...rest
}, ref) => {
  // const location = useLocation();
  const classes = useStyles();

  // const sendPageViewEvent = useCallback(() => {
  //   track.pageview({
  //     page_path: location.pathname
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   sendPageViewEvent();
  // }, [sendPageViewEvent]);

  return (
    <div
      ref={ref as any}
      {...rest}
      className={classes.root}
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </div>
  );
});

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Page;
