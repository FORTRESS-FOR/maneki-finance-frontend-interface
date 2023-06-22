import { CircularProgress, Paper, PaperProps, Typography, useTheme } from '@mui/material';
import Image from 'next/image';

interface ManekiLoadingPaperProps extends PaperProps {
  description?: string;
  withCircle?: boolean;
}
export default function ManekiLoadingPaper({
  description,
  withCircle,
  sx,
  ...rest
}: ManekiLoadingPaperProps) {
  const theme = useTheme();
  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        flex: 1,
        boxShaodw: `0px 10px 30px 10px ${theme.palette.shadow.dashboard}`,
        ...sx,
      }}
    >
      <Image src={'/maneki-3d.png'} width={'200px'} height={'200px'} alt="maneki cat in 3d" />

      <Typography variant="h3" sx={{ m: 6, color: 'text.secondary' }}>
        {description}
      </Typography>
      {withCircle ? <CircularProgress /> : <></>}
    </Paper>
  );
}
