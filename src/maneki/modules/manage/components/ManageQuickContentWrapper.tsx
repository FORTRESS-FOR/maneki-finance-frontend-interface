import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  Paper,
  SxProps,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { BigNumber } from 'ethers';
import React from 'react';
import { ReactNode } from 'react-markdown/lib/ast-to-react';

import { countDecimals, toWeiString } from '../utils/stringConverter';

interface CustomNumberFormatType {
  amountTo: string;
  setAmountTo: React.Dispatch<React.SetStateAction<string>>;
  balancePAW: string;
  sx?: SxProps;
  inputLabel?: string;
}

function CustomNumberFormat({
  amountTo,
  setAmountTo,
  balancePAW,
  sx,
  inputLabel,
}: CustomNumberFormatType) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const regex = /^(\d+\.?|\.?)\d*$/g;
    const countDec = countDecimals(event.target.value);
    if (regex.test(event.target.value)) {
      if (
        BigNumber.from(toWeiString(event.target.value)).gt(BigNumber.from(toWeiString(balancePAW)))
      ) {
        setAmountTo(balancePAW);
      } else if (countDec > 18) setAmountTo(amountTo);
      else setAmountTo(event.target.value);
    }
  }
  return (
    <TextField
      value={amountTo}
      placeholder="0.00"
      onChange={handleChange}
      variant="outlined"
      label={inputLabel ? inputLabel : ''}
      size="small"
      autoComplete="off"
      sx={{ ...sx }}
    />
  );
}

interface ManageQuickContentWrapperProps {
  svgIcon?: ReactNode;
  title: string;
  aprValue: string;
  descriptions: ReactNode[];
  balancePAW: string;
  amountTo: string;
  setAmountTo: React.Dispatch<React.SetStateAction<string>>;
  handleClick: () => void;
  buttonText: string;
  inputLabel?: string;
}

export default function ManageQuickContentWrapper({
  svgIcon,
  title,
  aprValue,
  descriptions,
  balancePAW,
  amountTo,
  setAmountTo,
  handleClick,
  buttonText,
  inputLabel,
}: ManageQuickContentWrapperProps) {
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        padding: '32px',
        boxShadow: `0px 10px 30px 10px ${theme.palette.shadow.dashboard}`,
        borderRadius: '14px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: '12px' }}>
          {svgIcon}
          <Typography variant="h3" fontWeight={'700'}>
            {title}
          </Typography>
        </Box>
        <Box
          sx={(theme) => ({
            display: 'flex',
            gap: '8px',
            padding: '12px',
            border: '1px solid rgb(68, 73, 92)',
            borderRadius: '12px',
            bgcolor: theme.palette.mode === 'light' ? 'rgba(247, 147, 26, 0.1)' : 'transparent',
          })}
        >
          <Typography fontWeight={600} fontSize={12}>
            APR
          </Typography>
          <Typography fontWeight={800} fontSize={16}>
            {aprValue} %
          </Typography>
        </Box>
      </Box>
      {descriptions.map((description, i) => (
        <Typography key={i} fontWeight={600} fontSize={'14px'}>
          {description}
        </Typography>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontSize={16} fontWeight={500}>
          <Trans>Wallet Balance</Trans> :
        </Typography>
        <Typography fontSize={16} fontWeight={600}>
          {balancePAW} PAW
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: downToSM ? 'column' : 'row',
          gap: downToSM ? '8px' : 'auto',
        }}
      >
        <CustomNumberFormat
          amountTo={amountTo}
          setAmountTo={setAmountTo}
          balancePAW={balancePAW}
          inputLabel={inputLabel}
          sx={{
            '& .MuiOutlinedInput-root.Mui-focused': {
              '& > fieldset': {
                borderColor: 'orange',
              },
            },
          }}
        />
        <Button
          onClick={handleClick}
          variant="contained"
          sx={{ padding: downToSM ? '8px 24px' : '0px 24px' }}
        >
          {buttonText}
        </Button>
      </Box>
    </Paper>
  );
}
