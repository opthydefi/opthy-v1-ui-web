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
import { SWRConfig } from "swr";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { EthereumProvider } from 'src/contexts/EthereumContext';
import { ContractsProvider } from 'src/contexts/ContractsContexts';



const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const swrConfig = {
  revalidateOnFocus: false,
  shouldRetryOnError: false
}



function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <EthereumProvider>
          <ContractsProvider>
            <SWRConfig value={swrConfig}>
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
            </SWRConfig>
          </ContractsProvider>
        </EthereumProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
