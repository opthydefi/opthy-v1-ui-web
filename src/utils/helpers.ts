import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { CODE_VARIANTS, LANGUAGES } from './constants';

import useSWRImmutable from 'swr/immutable';
import { ChainId, ERC20 } from 'opthy-v1-core';
// import { useWeb3React } from '@web3-react/core';
// import { AddressTranslator } from 'nervos-godwoken-integration';
import { getAddress } from '@ethersproject/address';
import useSWR from 'swr';
// import { opthysAddress, chainNameIDs, contract2ABI } from "opthy-v1-core";


// declare module "opthy" {
//   export function chainNameIDs(): any;
//   export function opthysAddress(chainId: number): any;
//   export function ERC20Whitelist(chainId: number): any;
//   export function contract2ABI(contractName: string): any;
// }
// import OPTHYABI from "opthy/contracts/artifacts/Opthy.json";
// import OPTHYSABI from "opthy/contracts/artifacts/Opthys.json";





// import OPTHYABI from "opthy/contracts/artifacts/Opthy.json";
// import OPTHYSABI from "opthy/contracts/artifacts/Opthys.json";

/**
 * Mapping from the date adapter sub-packages to the npm packages they require.
 * @example `@mui/lab/AdapterDateFns` has a peer dependency on `date-fns`.
 */
const dateAdapterPackageMapping: Record<string, string> = {
  AdapterDateFns: 'date-fns',
  AdapterDayjs: 'dayjs',
  AdapterLuxon: 'luxon',
  AdapterMoment: 'moment',
};

function titleize(hyphenedString: string): string {
  return hyphenedString
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export interface Page {
  pathname: string;
  subheader?: string;
  title?: string | false;
}

export function pageToTitle(page: Page): string | null {
  if (page.title === false) {
    return null;
  }

  if (page.title) {
    return page.title;
  }

  const path = page.subheader || page.pathname;
  const name = path.replace(/.*\//, '');

  if (path.indexOf('/api') === 0) {
    return upperFirst(camelCase(name));
  }

  return titleize(name);
}

export type Translate = (id: string, options?: Partial<{ ignoreWarning: boolean }>) => string;

export function pageToTitleI18n(page: Page, t: Translate): string | null {
  const path = page.subheader || page.pathname;
  return t(`pages.${path}`, { ignoreWarning: true }) || pageToTitle(page);
}

/**
 * @var
 * set of packages that ship their own typings instead of using @types/ namespace
 * Array because Set([iterable]) is not supported in IE11
 */
const packagesWithBundledTypes = ['date-fns', '@emotion/react', '@emotion/styled'];

/**
 * WARNING: Always uses `latest` typings.
 *
 * Adds dependencies to @types packages only for packages that are not listed
 * in packagesWithBundledTypes
 *
 * @see packagesWithBundledTypes in this module namespace
 * @param deps - list of dependency as `name => version`
 */
function addTypeDeps(deps: Record<string, string>): void {
  const packagesWithDTPackage = Object.keys(deps)
    .filter((name) => packagesWithBundledTypes.indexOf(name) === -1)
    // All the MUI packages come with bundled types
    .filter((name) => name.indexOf('@mui/') !== 0);

  packagesWithDTPackage.forEach((name) => {
    let resolvedName = name;
    // scoped package?
    if (name.startsWith('@')) {
      // https://github.com/DefinitelyTyped/DefinitelyTyped#what-about-scoped-packages
      resolvedName = name.slice(1).replace('/', '__');
    }

    deps[`@types/${resolvedName}`] = 'latest';
  });
}

function includePeerDependencies(
  deps: Record<string, string>,
  versions: Record<string, string>,
): Record<string, string> {
  let newDeps: Record<string, string> = {
    ...deps,
    'react-dom': versions['react-dom'],
    react: versions.react,
    '@emotion/react': versions['@emotion/react'],
    '@emotion/styled': versions['@emotion/styled'],
  };

  if (newDeps['@mui/lab']) {
    newDeps['@mui/material'] = versions['@mui/material'];
  }

  if (newDeps['@material-ui/data-grid']) {
    newDeps['@mui/material'] = versions['@mui/material'];
    newDeps['@mui/styles'] = versions['@mui/styles'];
  }

  // TODO: Where is this coming from and why does it need to be injected this way.
  if ((window as any).muiDocConfig) {
    newDeps = (window as any).muiDocConfig.csbIncludePeerDependencies(newDeps, { versions });
  }

  return newDeps;
}

/**
 * @param packageName - The name of a package living inside this repository.
 * @param commitRef
 * @return string - A valid version for a dependency entry in a package.json
 */
function getMuiPackageVersion(packageName: string, commitRef?: string): string {
  if (
    commitRef === undefined ||
    process.env.SOURCE_CODE_REPO !== 'https://github.com/mui-org/material-ui'
  ) {
    // #default-branch-switch
    return 'latest';
  }
  const shortSha = commitRef.slice(0, 8);
  return `https://pkg.csb.dev/mui-org/material-ui/commit/${shortSha}/@mui/${packageName}`;
}

/**
 * @param raw - ES6 source with es module imports
 * @param options
 * @returns map of packages with their required version
 */
export function getDependencies(
  raw: string,
  options: {
    codeLanguage?: 'JS' | 'TS';
    /**
     * If specified use `@mui/*` packages from a specific commit.
     */
    muiCommitRef?: string;
  } = {},
) {
  const { codeLanguage = CODE_VARIANTS.JS, muiCommitRef } = options;

  let deps: Record<string, string> = {};
  let versions: Record<string, string> = {
    react: 'latest',
    'react-dom': 'latest',
    '@emotion/react': 'latest',
    '@emotion/styled': 'latest',
    '@mui/material': getMuiPackageVersion('material', muiCommitRef),
    '@mui/icons-material': getMuiPackageVersion('icons-material', muiCommitRef),
    '@mui/lab': getMuiPackageVersion('lab', muiCommitRef),
    '@mui/styled-engine': getMuiPackageVersion('styled-engine', muiCommitRef),
    '@mui/styles': getMuiPackageVersion('styles', muiCommitRef),
    '@mui/system': getMuiPackageVersion('system', muiCommitRef),
    '@mui/private-theming': getMuiPackageVersion('theming', muiCommitRef),
    '@mui/core': getMuiPackageVersion('core', muiCommitRef),
    '@mui/utils': getMuiPackageVersion('utils', muiCommitRef),
    '@mui/material-next': getMuiPackageVersion('material-next', muiCommitRef),
    '@mui/joy': getMuiPackageVersion('joy', muiCommitRef),
  };

  // TODO: Where is this coming from and why does it need to be injected this way.
  if ((window as any).muiDocConfig) {
    versions = (window as any).muiDocConfig.csbGetVersions(versions, { muiCommitRef });
  }

  const re = /^import\s'([^']+)'|import\s[\s\S]*?\sfrom\s+'([^']+)/gm;
  let m: RegExpExecArray | null = null;
  // eslint-disable-next-line no-cond-assign
  while ((m = re.exec(raw))) {
    let name;

    if (m[2]) {
      // full import
      // handle scope names
      name = m[2].charAt(0) === '@' ? m[2].split('/', 2).join('/') : m[2].split('/', 1)[0];
    } else {
      name = m[1];
    }

    if (!deps[name]) {
      deps[name] = versions[name] ? versions[name] : 'latest';
    }

    // e.g date-fns
    const dateAdapterMatch = m[2].match(/^@mui\/lab\/(Adapter.*)/);
    if (dateAdapterMatch !== null) {
      const packageName = dateAdapterPackageMapping[dateAdapterMatch[1]];
      if (packageName === undefined) {
        throw new TypeError(
          `Can't determine required npm package for adapter '${dateAdapterMatch[1]}'`,
        );
      }
      deps[packageName] = 'latest';
    }
  }

  deps = includePeerDependencies(deps, versions);

  if (codeLanguage === CODE_VARIANTS.TS) {
    addTypeDeps(deps);
    deps.typescript = 'latest';
  }

  if (!deps['@mui/material']) {
    // The `index.js` imports StyledEngineProvider from '@mui/material', so we need to make sure we have it as a dependency
    const name = '@mui/material';
    deps[name] = versions[name] ? versions[name] : 'latest';
  }

  return deps;
}

/**
 * Get the value of a cookie
 * Source: https://vanillajstoolkit.com/helpers/getcookie/
 * @param name - The name of the cookie
 * @return The cookie value
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    throw new Error(
      'getCookie() is not supported on the server. Fallback to a different value when rendering on the server.',
    );
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts[1].split(';').shift();
  }

  return undefined;
}

export function pathnameToLanguage(pathname: string): { userLanguage: string; canonical: string } {
  const userLanguage = pathname.substring(1, 3);

  if (LANGUAGES.indexOf(userLanguage) !== -1 && pathname.indexOf(`/${userLanguage}/`) === 0) {
    return {
      userLanguage,
      canonical: userLanguage === 'en' ? pathname : pathname.substring(3),
    };
  }

  return {
    userLanguage: 'en',
    canonical: pathname,
  };
}

export function escapeCell(value: string): string {
  // As the pipe is use for the table structure
  return value.replace(/</g, '&lt;').replace(/`&lt;/g, '`<').replace(/\|/g, '\\|');
}

// a.get('RinkebyTestnet')

// console.log(opthysAddress, 'chainNameIDs, opthysAddress, contract2ABI');
export const name2ABI = (contractName: string) => {
  if (contractName === "Opthy") {
    // return OPTHYABI.abi as any;
    return 1;
  }
  // if (contractName === "Opthys") {
  //   return OPTHYSABI.abi as any;
  // }
}


export const NervosChainId = 71393;

export const isNervos = (chainId: any) => (Number(chainId) == NervosChainId);

// export const usePolyWeb3React = () => {
//   // const result: any = useWeb3React();
//   // console.log("result =", result);
//   if (result.account) {
//       if (isNervos(result.chainId)) {
//           // const addressTranslator = new AddressTranslator();
//           // const polyaccount = addressTranslator.ethAddressToGodwokenShortAddress(result.account);
//           // result.polyaccount = getAddress(polyaccount);//transform to Checksum Address
//       } else {
//           result.polyaccount = result.account;
//       }
//   }

//   return result
// }
const ERCMetaData = ERC20(ChainId.RinkebyTestnet);
// console.log("ERCMetaData = ", ERCMetaData);
export const useERC20Metadata = (ERC20Address: string) => {

  let { data: name } = useSWRImmutable([ERCMetaData.ABI, ERC20Address, 'name']);
  if (!name) {
      name = ERC20Address.slice(-5);
  }

  let { data: symbol } = useSWRImmutable([ERCMetaData.ABI, ERC20Address, 'symbol']);
  if (!symbol) {
      symbol = ERC20Address.slice(-5);
  }

  let { data: decimals } = useSWRImmutable([ERCMetaData.ABI, ERC20Address, 'decimals']);
  if (!decimals) {
      decimals = 18;
  }

  // const whitelist = useERC20TOKENSWhitelist()
  // const isWhitelisted = whitelist ? whitelist.has(ERC20Address) : false;

  // const logo = useERC20Logo(symbol)

  const ABI = ERC20

  //Add other ERC20 metadata here///////////////////////////

  return { name, symbol, decimals, ABI }
}

// export const ERC20Balance = (ERC20Address: string) => {
  
//   const { data: blanace, error, mutate, isValidating } = useSWR([ERCMetaData.ABI, ERC20Address, "balanceOf", "0x9d23e5D38C31DF9FF11512e40f43a2a4Fa7a3b41" ]);
//   console.log("error = ", error);
//   return { blanace }
// }

// const useERC20TOKENSWhitelist = () => {
//   const { chainId } = useWeb3React()
//   if (chainId == NervosChainId) {
//       return new Set([
//           "0x034f40c41Bb7D27965623f7bb136CC44D78be5E7", // ckETH
//           "0xC818545C50a0E2568E031Ef9150849b396992880", // ckDAI
//           "0x1b98136005d568B23b7328F279948648992e1fD2", // ckUSDC
//           "0xEabAe0083967F2360848efC65C9c967135e80EE4", // ckUSDT
//       ])
//   }
//   if (chainId == RinkebyChainId) {
//       return new Set();
//   }
// }

export const CURRENCY_CONVERT = (convertFrom: string) => {
    const fetcher = (url: RequestInfo) => fetch(url).then(r => r.json())
    let { data: convertResult, error: currencyError, mutate: currencyMutate, isValidating: currencyIsValidating } = useSWR('https://api.diadata.org/v1/quotation/' + ((convertFrom.length !== 5) ? convertFrom : "DAI"), fetcher)
    return { convertResult, currencyError, currencyMutate, currencyIsValidating };
}
