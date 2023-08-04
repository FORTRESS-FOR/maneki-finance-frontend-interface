import { BigNumber, Contract } from 'ethers';
import React from 'react';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import LENDING_PROTOCOL_DATA_PROVIDER_ABI from 'src/maneki/abi/lendingProtocolDataProviderABI';
import MANEKI_PRICE_ORACLE_ABI from 'src/maneki/abi/priceOracleABI';
import PROXY_TOKEN_ABI from 'src/maneki/abi/proxyTokenABI';
import {
  collateralAssetsType,
  convertReserveTokens,
} from 'src/maneki/modules/leverage/utils/leverageActionHelper';
import { marketsData } from 'src/ui-config/marketsConfig';

import { LEVERAGE_STABLE_COINS, LEVERAGE_UNSTABLE_COINS } from '../../modules/leverage/config';

export interface IBorrowAssets {
  unstable: string;
  stable: string;
}

export interface IBorrowAmount {
  unstable: BigNumber;
  stable: BigNumber;
}

export interface IleverageBorrowAsset {
  symbol: string;
  address: string;
}

export interface ITxStatus {
  status: 'success' | 'error' | 'approve' | '';
  message: string;
  hash?: string;
}

interface ILeverageData {
  collateralAmount: BigNumber;
  setCollateralAmount: (value: BigNumber) => void;
  collateralValue: BigNumber;
  setCollateralValue: (value: BigNumber) => void;
  collateralAssets: collateralAssetsType[];
  setCollateralAssets: (asset: collateralAssetsType[]) => void;
  walletBalance: BigNumber;
  setWalletBalance: (value: BigNumber) => void;
  leverage: number;
  setLeverage: (value: number) => void;
  leverageLoading: boolean;
  setLeverageLoading: (value: boolean) => void;
  assetsLoading: boolean;
  setAssetsLoading: (value: boolean) => void;
  currentCollateral: collateralAssetsType;
  setCurrentCollateral: (value: collateralAssetsType) => void;
  borrowAssets: IBorrowAssets;
  setBorrowAssets: (value: IBorrowAssets) => void; // Moved out to constant
  currentBorrowedStableAsset: IleverageBorrowAsset | null;
  setCurrentBorrowedStableAsset: (value: IleverageBorrowAsset) => void;
  currentBorrowedUnstableAsset: IleverageBorrowAsset | null;
  setCurrentBorrowedUnstableAsset: (value: IleverageBorrowAsset) => void;
  borrowAmount: IBorrowAmount;
  setBorrowAmount: (value: IBorrowAmount) => void;
  ratio: number[];
  setRatio: (value: number[]) => void;
  txStatus: ITxStatus;
  setTxStatus: (value: ITxStatus) => void;
}

export const LeverageDataProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const [collateralAmount, setCollateralAmount] = React.useState<BigNumber>(BigNumber.from(-1));
  const [collateralValue, setCollateralValue] = React.useState<BigNumber>(BigNumber.from(-1));
  const [collateralAssets, setCollateralAssets] = React.useState<collateralAssetsType[]>([]);
  const [currentCollateral, setCurrentCollateral] = React.useState<collateralAssetsType>({
    token: '',
    address: '',
    value: BigNumber.from(0),
    balance: BigNumber.from(0),
    decimals: 0,
  });
  const [borrowAssets, setBorrowAssets] = React.useState<IBorrowAssets>({
    unstable: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    stable: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  });
  const [currentBorrowedStableAsset, setCurrentBorrowedStableAsset] =
    React.useState<IleverageBorrowAsset>(LEVERAGE_STABLE_COINS[0]);
  const [currentBorrowedUnstableAsset, setCurrentBorrowedUnstableAsset] =
    React.useState<IleverageBorrowAsset>(LEVERAGE_UNSTABLE_COINS[0]);
  const [borrowAmount, setBorrowAmount] = React.useState<IBorrowAmount>({
    unstable: BigNumber.from(0),
    stable: BigNumber.from(0),
  });
  const [ratio, setRatio] = React.useState<number[]>([5000, 5000]); // 10000 = 100%
  const [walletBalance, setWalletBalance] = React.useState<BigNumber>(BigNumber.from(-1));
  const [leverage, setLeverage] = React.useState<number>(2);
  const [assetsLoading, setAssetsLoading] = React.useState<boolean>(true);
  const [leverageLoading, setLeverageLoading] = React.useState<boolean>(true);
  const [txStatus, setTxStatus] = React.useState<ITxStatus>({
    status: '',
    message: '',
    hash: '',
  });
  const { provider, currentAccount } = useWeb3Context();
  const PROTOCOL_DATA_PROVIDER = marketsData.arbitrum_mainnet_v3.addresses
    .LENDING_PROTOCOL_DATA_PROVIDER as string;
  const PRICE_ORACLE = marketsData.arbitrum_mainnet_v3.addresses.PRICE_ORACLE as string;

  React.useEffect(() => {
    if (!provider || !currentAccount) return;
    if (!assetsLoading) return;

    const getCollateralAssets = async () => {
      const dataProviderContract = new Contract(
        PROTOCOL_DATA_PROVIDER,
        LENDING_PROTOCOL_DATA_PROVIDER_ABI,
        provider
      );
      const priceOracleContract = new Contract(PRICE_ORACLE, MANEKI_PRICE_ORACLE_ABI, provider);
      try {
        const dataProvider = await dataProviderContract.getAllReservesTokens();
        const assetsObject = convertReserveTokens(dataProvider);
        const priceOracle = await priceOracleContract.getAssetsPrices(
          assetsObject.map((obj) => obj['address'])
        );
        for (let i = 0; i < assetsObject.length; i++) {
          assetsObject[i].value = priceOracle[i];
        }
        const assetWithBalances = (await getAssetsBalance(
          assetsObject,
          currentAccount
        )) as collateralAssetsType[];
        setCollateralAssets(assetWithBalances);
        setCurrentCollateral(assetWithBalances.filter((asset) => asset['token'] === 'GLP')[0]);
        setAssetsLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    getCollateralAssets();
    // eslint-disable-next-line
  }, [provider, currentAccount, assetsLoading, PROTOCOL_DATA_PROVIDER, PRICE_ORACLE]);

  const getAssetsBalance = async (
    collateralAssets: collateralAssetsType[],
    currentAccount: string
  ) => {
    for (let i = 0; i < collateralAssets.length; i++) {
      const contract = new Contract(collateralAssets[i].address, PROXY_TOKEN_ABI, provider);
      const promises = [];

      promises.push(contract.balanceOf(currentAccount) as BigNumber);
      promises.push(contract.decimals() as BigNumber);

      type promiseType = BigNumber | number;
      const promiseReturn = await Promise.all(promises)
        .then((data: promiseType[]) => {
          return data;
        })
        .catch((e) => {
          console.log('Asset Balance Error: ', e);
          return [BigNumber.from(0), 0];
        });
      collateralAssets[i].balance = promiseReturn[0] as BigNumber;
      collateralAssets[i].decimals = promiseReturn[1] as number;

      /**
       * Set supported stable & unstable coins for leverage
       */
      // LEVERAGE_STABLE_COINS.map((e) => {
      //   if (
      //     (e.symbol.startsWith('W') && collateralAssets[i].token == e.symbol.substring(1)) ||
      //     collateralAssets[i].token == e.symbol
      //   ) {
      //     collateralAssets[i].mandatoryStableCoin = e.symbol;
      //   }
      // });

      // LEVERAGE_UNSTABLE_COINS.map((e) => {
      //   if (
      //     (collateralAssets[i].token.startsWith('W') &&
      //       collateralAssets[i].token.substring(1) == e.symbol) ||
      //     collateralAssets[i].token == e.symbol
      //   ) {
      //     collateralAssets[i].mandatoryUnstableCoin = e.symbol;
      //   }
      // });
    }

    return collateralAssets;
  };

  return (
    <LeverageContext.Provider
      value={{
        collateralAmount,
        setCollateralAmount,
        collateralValue,
        setCollateralValue,
        collateralAssets,
        setCollateralAssets,
        walletBalance,
        setWalletBalance,
        leverage,
        setLeverage,
        leverageLoading,
        setLeverageLoading,
        assetsLoading,
        setAssetsLoading,
        currentCollateral,
        setCurrentCollateral,
        borrowAssets,
        setBorrowAssets,
        currentBorrowedStableAsset,
        setCurrentBorrowedUnstableAsset,
        currentBorrowedUnstableAsset,
        setCurrentBorrowedStableAsset,
        borrowAmount,
        setBorrowAmount,
        ratio,
        setRatio,
        txStatus,
        setTxStatus,
      }}
    >
      {children}
    </LeverageContext.Provider>
  );
};

export const LeverageContext = React.createContext({} as ILeverageData);

export const useLeverageContext = () => {
  const LeverageData = React.useContext(LeverageContext);

  return LeverageData;
};
