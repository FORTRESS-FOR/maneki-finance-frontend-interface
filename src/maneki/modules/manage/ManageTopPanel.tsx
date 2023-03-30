import { Trans } from '@lingui/macro';
import { useMediaQuery, useTheme } from '@mui/material';
import { Contract } from 'ethers';
import * as React from 'react';

import PieIcon from '../../../../public/icons/markets/pie-icon.svg';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import { TopInfoPanel } from '../../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../../components/TopInfoPanel/TopInfoPanelItem';
import { useWeb3Context } from '../../../libs/hooks/useWeb3Context';
import { marketsData } from '../../../ui-config/marketsConfig';
import { useManageContext } from '../../hooks/manage-data-provider/ManageDataProvider';
import MULTI_FEE_ABI from './MultiFeeABI';

interface NumReturn {
  _hex: string;
  _isBigNumber: boolean;
}

export const ManageTopPanel = () => {
  const { stakedPAW, lockedPAW, setStakedPAW, setLockedPAW } = useManageContext();
  const [dailyPlatformFees, setDailyPlatformFees] = React.useState<number>(-1);
  const [dailyPenaltyFees, setDailyPenaltyFees] = React.useState<number>(-1);
  const [dailyRevenue, setDailyRevenue] = React.useState<number>(-1);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { provider } = useWeb3Context();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));

  const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsVariant = downToSM ? 'secondary16' : 'secondary21';
  const MULTI_FEE_ADDR = marketsData.bsc_testnet_v3.addresses.MERKLE_DIST as string;

  React.useEffect(() => {
    // create contract
    const contract = new Contract(MULTI_FEE_ADDR, MULTI_FEE_ABI, provider);

    const promises = [];

    // add contract call into promise arr
    promises.push(contract.duration());
    promises.push(contract.duration());
    promises.push(contract.duration());
    promises.push(contract.duration());
    promises.push(contract.duration());

    // call promise all and get data
    Promise.all(promises)
      .then((data: NumReturn[]) => {
        // dev change data setting logic here
        setStakedPAW(parseInt(data[0]._hex, 16));
        setDailyPlatformFees(parseInt(data[1]._hex, 16));
        setDailyRevenue(parseInt(data[2]._hex, 16));
        setDailyPenaltyFees(parseInt(data[3]._hex, 16));
        setLockedPAW(parseInt(data[4]._hex, 16));
        setLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);
  return (
    <TopInfoPanel pageTitle={<Trans>Manage PAW</Trans>}>
      {/* Staked paw display */}
      <TopInfoPanelItem
        icon={<PieIcon />}
        title={<Trans>Staked + Locked PAW</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={(stakedPAW + lockedPAW).toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>

      {/* Daily revenue display */}
      <TopInfoPanelItem icon={<PieIcon />} title={<Trans>Daily revenue</Trans>} loading={loading}>
        <FormattedNumber
          value={dailyRevenue.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>

      {/* weekly revenue display */}
      <TopInfoPanelItem icon={<PieIcon />} title={<Trans>Weekly revenue</Trans>} loading={loading}>
        <FormattedNumber
          value={(7 * dailyRevenue).toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>

      {/* Platform fee display */}
      <TopInfoPanelItem
        icon={<PieIcon />}
        title={<Trans>Daily playform fees</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={dailyPlatformFees.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>

      {/* Penalty Fee display */}
      <TopInfoPanelItem
        icon={<PieIcon />}
        title={<Trans>Daily penalty fees</Trans>}
        loading={loading}
      >
        <FormattedNumber
          value={dailyPenaltyFees.toString()}
          symbol="USD"
          variant={valueTypographyVariant}
          visibleDecimals={2}
          compact
          symbolsColor="#A5A8B6"
          symbolsVariant={symbolsVariant}
        />
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
