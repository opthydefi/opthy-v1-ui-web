import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { create } from 'jss';
import rtl from 'jss-rtl';
import jssPreset from "@mui/styles/jssPreset"
import StylesProvider from "@mui/styles/StylesProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyles from 'src/components/GlobalStyles';
import routes, { renderRoutes } from 'src/routes';

import { EthereumProvider } from 'src/contexts/EthereumContext';


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });



function App() {
  return (
    <ThemeProvider>
      <EthereumProvider>

        <StylesProvider jss={jss}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>


            <BrowserRouter>
              <GlobalStyles />
              {/* <Web3ReactProvider getLibrary={getLibrary}>
              <Wallet />
            </Web3ReactProvider> */}
              {renderRoutes(routes)}
            </BrowserRouter>


          </LocalizationProvider>
        </StylesProvider>

      </EthereumProvider>
    </ThemeProvider>
  );
}

export default App;
