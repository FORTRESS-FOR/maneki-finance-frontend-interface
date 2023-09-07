import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { opbnbTestnetNetworkSwitcher } from '../utils/networkSwitcher';

const networkSwitcher = opbnbTestnetNetworkSwitcher;

const SwitchNetworkHeader = () => {
  const theme = useTheme();
  const downToMD = useMediaQuery(theme.breakpoints.down('md'));

  const { chainId, currentAccount } = useWeb3Context();
  const { currentMarketData } = useProtocolDataContext();

  if (!currentAccount || chainId === currentMarketData.chainId) return <></>;
  return (
    <Box
      sx={{
        bgcolor: '#F26464',
        p: '12px 20px',
        display: 'flex',
        flexDirection: downToMD ? 'column' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: downToMD ? '0px' : '12px',
      }}
    >
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '21px',
          color: 'background.default',
        }}
      >
        {downToMD ? (
          <Trans>Connected to Wrong Network</Trans>
        ) : (
          <Trans>You are current connected to the wrong network</Trans>
        )}
      </Typography>
      <Button
        onClick={networkSwitcher}
        sx={{
          fontSize: '16px',
          fontWeight: '900',
          lineHeight: '21px',
          color: 'background.default',
          textDecoration: 'underline',
        }}
      >
        {downToMD ? (
          <Trans>Switch to {currentMarketData.marketTitle}</Trans>
        ) : (
          <Trans>Switch to {currentMarketData.marketTitle}</Trans>
        )}
      </Button>
    </Box>
  );
};

const SwitchNetworkButton = () => {
  const { currentMarketData } = useProtocolDataContext();
  return (
    <Button onClick={networkSwitcher} variant="wallet">
      <Trans>Switch to {currentMarketData.marketTitle}</Trans>
    </Button>
  );
};

export { SwitchNetworkButton, SwitchNetworkHeader };
