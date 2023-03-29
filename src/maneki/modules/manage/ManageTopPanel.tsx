import { Trans } from '@lingui/macro';
import * as React from 'react';

import { TopInfoPanel } from '../../../components/TopInfoPanel/TopInfoPanel';

export const ManageTopPanel = () => {
  return (
    <TopInfoPanel pageTitle={<Trans>Manage</Trans>}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industrys standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centurie
    </TopInfoPanel>
  );
};
