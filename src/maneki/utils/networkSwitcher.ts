export enum manekiChainId {
  base = '8453',
  base_testnet = '84531',
  bsc_testnet = '97',
  opbnb = '204',
  opbnb_testnet = '5611',
}

export type switchNetworkType = {
  chainId: string | number;
};

export type addNetworkType = {
  chainId: string | number;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: {
    symbol: string;
    name: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
};

export const networkSwitcher = async (
  switchNetworkParam: switchNetworkType[],
  addNetworkParam: addNetworkType[]
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: switchNetworkParam,
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: addNetworkParam,
        });
      } catch (addError) {
        // handle "add" error
        console.log('Add Error Message: ', addError.message);
      }
    } else {
      console.log('Switch Error Message: ', switchError.message);
    }
  }
};

export const switchNetworkParams: Record<string, switchNetworkType[]> = {
  [manekiChainId.base]: [{ chainId: '0x2105' || 8453 }],
  [manekiChainId.base_testnet]: [{ chainId: '0x14a33' || 84531 }],
  [manekiChainId.bsc_testnet]: [{ chainId: '0x61' || 97 }],
  [manekiChainId.opbnb]: [{ chainId: '0xcc' || 204 }],
  [manekiChainId.opbnb_testnet]: [{ chainId: '0x15eb' || 5611 }],
};

export const addNetworkParams: Record<string, addNetworkType[]> = {
  [manekiChainId.bsc_testnet]: [
    {
      chainId: '0x61' || 97,
      rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
      chainName: 'BNB Smart Chain - Testnet',
      nativeCurrency: {
        symbol: 'TBNB',
        name: 'Binance',
        decimals: 18,
      },
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
  ],
  [manekiChainId.base]: [
    {
      chainId: '0x2105' || 8453,
      rpcUrls: ['https://mainnet.base.org', 'https://base.meowrpc.com', 'https://1rpc.io/base'],
      chainName: 'Base Mainnet',
      nativeCurrency: {
        symbol: 'ETH',
        name: 'Base',
        decimals: 18,
      },
      blockExplorerUrls: ['https://basescan.org/'],
    },
  ],
  [manekiChainId.base_testnet]: [
    {
      chainId: '0x14a33' || 84531,
      rpcUrls: [
        'https://goerli.base.org',
        'https://base-goerli.public.blastapi.io',
        'https://1rpc.io/base-goerli',
      ],
      chainName: 'Base Goerli',
      nativeCurrency: {
        symbol: 'ETH',
        name: 'Base Goerli',
        decimals: 18,
      },
      blockExplorerUrls: ['https://goerli.basescan.org'],
    },
  ],
  [manekiChainId.opbnb]: [
    {
      chainId: '0xcc' || 204,
      rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org', 'https://opbnb-mainnet-rpc.bnbchain.org'],
      chainName: 'opBNB Mainnet',
      nativeCurrency: {
        symbol: 'BNB',
        name: 'opBNB',
        decimals: 18,
      },
      blockExplorerUrls: ['https://opbnbscan.com/'],
    },
  ],
  [manekiChainId.opbnb_testnet]: [
    {
      chainId: '0x15eb' || 5611,
      rpcUrls: ['https://opbnb-testnet-rpc.bnbchain.org', 'https://opbnb-testnet-rpc.bnbchain.org'],
      chainName: 'opBNB Testnet',
      nativeCurrency: {
        symbol: 'BNB',
        name: 'opBNB Testnet',
        decimals: 18,
      },
      blockExplorerUrls: ['https://opbnb-testnet.bscscan.com/'],
    },
  ],
};

export const baseNetworkSwitcher = async () =>
  await networkSwitcher(
    switchNetworkParams[manekiChainId.base],
    addNetworkParams[manekiChainId.base]
  );
export const baseTestnetNetworkSwitcher = async () =>
  await networkSwitcher(
    switchNetworkParams[manekiChainId.base_testnet],
    addNetworkParams[manekiChainId.base_testnet]
  );

export const opbnbNetworkSwitcher = async () =>
  await networkSwitcher(
    switchNetworkParams[manekiChainId.base_testnet],
    addNetworkParams[manekiChainId.base_testnet]
  );

export const opbnbTestnetNetworkSwitcher = async () =>
  await networkSwitcher(
    switchNetworkParams[manekiChainId.base_testnet],
    addNetworkParams[manekiChainId.base_testnet]
  );
