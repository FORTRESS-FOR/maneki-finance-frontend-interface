/* eslint-disable @typescript-eslint/no-explicit-any */
import AddModeratorOutlinedIcon from '@mui/icons-material/AddModeratorOutlined';
import EnhancedEncryptionOutlinedIcon from '@mui/icons-material/EnhancedEncryptionOutlined';
import { Box } from '@mui/material';
import { BigNumber, Contract, utils } from 'ethers';
import * as React from 'react';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import ManekiLoadingPaper from 'src/maneki/utils/ManekiLoadingPaper';

import { useWeb3Context } from '../../../libs/hooks/useWeb3Context';
import { marketsData } from '../../../ui-config/marketsConfig';
import { useManageContext } from '../../hooks/manage-data-provider/ManageDataProvider';
import ManageQuickContentWrapper from './components/ManageQuickContentWrapper';
import MANEKI_DATA_PROVIDER_ABI from './DataABI';
import PAW_TOKEN_ABI from './PAWTokenABI';
import { toWeiString } from './utils/stringConverter';
// interface NumReturn {
//   _hex: string;
//   _isBigNumber: boolean;
// }

export const ManageQuickActions = () => {
  const { balancePAW, setBalancePAW } = useManageContext();
  const [stakingAPR, setStakingAPR] = React.useState<BigNumber>(BigNumber.from(-1));
  const [lockingAPR, setLockingAPR] = React.useState<BigNumber>(BigNumber.from(-1));
  const [amountToStake, setAmountToStake] = React.useState<string>('');
  const [amountToLock, setAmountToLock] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(true);
  const { provider, currentAccount } = useWeb3Context();
  const PAW_TOKEN_ADDR = marketsData.bsc_testnet_v3.addresses.PAW_TOKEN as string;
  const MANEKI_DATA_PROVIDER_ADDR = marketsData.bsc_testnet_v3.addresses
    .STAKING_DATA_PROVIDER as string;
  const { openManage } = useModalContext();

  // handle lock action
  const handleLock = () => {
    if (BigNumber.from(toWeiString(amountToLock)).isZero()) return;
    openManage(amountToLock, ModalType.ManageLock);
  };

  // handle stake action
  const handleStake = () => {
    // create contract
    if (BigNumber.from(toWeiString(amountToStake)).isZero()) return;
    openManage(amountToStake, ModalType.ManageStake);
  };

  React.useEffect(() => {
    // create contracts
    const contract = new Contract(MANEKI_DATA_PROVIDER_ADDR, MANEKI_DATA_PROVIDER_ABI, provider);
    const pawContract = new Contract(PAW_TOKEN_ADDR, PAW_TOKEN_ABI, provider);
    const promises = [];

    // add contract call into promise arr
    promises.push(pawContract.balanceOf(currentAccount)); // balance
    promises.push(contract.getStakingAPR()); // staking apr
    promises.push(contract.getLockingAPR()); // locking apr

    // call promise all and get data
    Promise.all(promises)
      .then((data: BigNumber[]) => {
        // dev change data setting logic here

        setBalancePAW(data[0]);
        setStakingAPR(data[1]);
        setLockingAPR(data[2]);

        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  if (loading) return <ManekiLoadingPaper description="Loading..." withCircle />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: '30%' }}>
      <ManageQuickContentWrapper
        svgIcon={<AddModeratorOutlinedIcon sx={{ transform: 'scale(1.3)' }} />}
        title={'Stake PAW'}
        aprValue={(stakingAPR.toNumber() / 100_000_000).toFixed(2)}
        descriptions={['Stake PAW and earn platform fees with no lockup period.']}
        balancePAW={utils.formatUnits(balancePAW, 18)}
        amountTo={amountToStake}
        setAmountTo={setAmountToStake}
        handleClick={handleStake}
        buttonText={'Stake'}
        inputLabel="Stake"
      />
      <ManageQuickContentWrapper
        svgIcon={<EnhancedEncryptionOutlinedIcon sx={{ transform: 'scale(1.3)' }} />}
        title={'Lock PAW'}
        aprValue={(lockingAPR.toNumber() / 100_000_000).toFixed(2)}
        descriptions={[
          'Lock PAW and earn platform fees and penalty fees in unlocked PAW.',
          'Locked PAW is subject to a three month lock and will continue to earn fees after the locks expire if you do not withdraw.',
        ]}
        balancePAW={utils.formatUnits(balancePAW, 18)}
        amountTo={amountToLock}
        setAmountTo={setAmountToLock}
        handleClick={handleLock}
        buttonText={'Lock'}
        inputLabel="Lock"
      />
    </Box>
  );
};
