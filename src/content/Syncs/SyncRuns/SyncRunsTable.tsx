// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 5:38:11 pm
 * Author: Nagendra S @ valmi.io
 */

import { useState } from 'react';

import { useRouter } from 'next/router';

import { Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';

import { getErrorInSyncRun } from '@content/Syncs/SyncRuns/SyncRunsUtils';

import AlertComponent from '@components/Alert';

import { SyncRunColumns } from './SyncRunColumns';
import SyncRunTableRow from './SyncRunTableRow';
import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { redirectToDataFlowRunLogs } from '@/utils/router-utils';

import { TData } from '@/utils/typings.d';

type SyncRunsTableProps = {
  syncRunsData: TData;
  syncId: string;
  isRetlFlow: boolean;
};

const SyncRunsTable = ({ syncRunsData, syncId, isRetlFlow }: SyncRunsTableProps) => {
  const router = useRouter();

  const { workspaceId = '' } = useWorkspaceId();

  const [errorDialog, showErrorDialog] = useState(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState('');

  {
    /** Sync Run Error */
  }
  const displayError = (syncRun, connection = '') => {
    const syncErrorMessage = getErrorInSyncRun(syncRun, connection);
    setSyncErrorMessage(syncErrorMessage);
    showErrorDialog(true);
  };

  const handleClose = () => {
    showErrorDialog(false);
  };

  const navigateToLogs = (syncRun, connection) => {
    redirectToDataFlowRunLogs({
      router,
      wid: workspaceId,
      connectionType: connection,
      connId: syncId,
      runId: syncRun.run_id
    });
  };

  return (
    <>
      <AlertComponent open={errorDialog} onClose={handleClose} message={syncErrorMessage} isError={true} />
      {/* Syncs Table*/}
      <TableContainer component={Paper} variant="outlined">
        <Table>
          {/* Syncs Table Columns */}
          <TableHead>
            <TableHeader columns={SyncRunColumns} />
          </TableHead>

          {/* Syncs Table Body */}
          <TableBody>
            {syncRunsData.ids.map((id) => {
              const run = syncRunsData.entities[id];

              return (
                <SyncRunTableRow
                  key={`run_key ${run.run_id}`}
                  displayError={displayError}
                  syncRun={run}
                  onLogClick={navigateToLogs}
                  isRetlFlow={isRetlFlow}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SyncRunsTable;
