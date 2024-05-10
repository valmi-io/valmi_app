//@S-Nagendra
import AlertComponent, { AlertStatus, AlertType } from '@/components/Alert';
import DataTable from '@/components/DataTable';
import ListEmptyComponent from '@/components/ListEmptyComponent';
import ContentLayout from '@/layouts/ContentLayout';
import { IPreviewPage } from '@/pagesspaces/[wid]/prompts/[pid]';
import { queryHandler } from '@/services';
import { useCreateExploreMutation, useGetPromptPreviewMutation } from '@/store/api/etlApiSlice';
import { generateExplorePayload } from '@/utils/explore-utils';
import { FormStatus } from '@/utils/form-utils';
import { getBaseRoute, isDataEmpty } from '@/utils/lib';
import { TData } from '@/utils/typings.d';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PromptFilter from '@/content/Prompts/PromptFilter';
import { Paper } from '@mui/material';
import moment from 'moment';
import { TPromptSource } from '@/content/Prompts/Prompt';
import { TPayloadOut, generatePreviewPayload } from '@/content/Prompts/promptUtils';

const PreviewTable = ({ params, sources }: { params: IPreviewPage; sources: TPromptSource[] }) => {
  const { pid = '', wid = '', filter = '' } = params;

  console.log('Preview table sources:_', sources);

  const router = useRouter();

  // Mutation for creating stream
  const [preview, { isLoading, isSuccess, data, isError, error }] = useGetPromptPreviewMutation();

  const [createObject] = useCreateExploreMutation();

  const { data: session } = useSession();
  const { user = {} } = session ?? {};

  // form state - form can be in any of the states {FormStatus}
  const [status, setStatus] = useState<FormStatus>('empty');

  // alert state
  const [alertState, setAlertState] = useState<AlertType>({
    message: '',
    show: false,
    type: 'empty'
  });

  useEffect(() => {
    if (pid) {
      const payload: TPayloadOut = generatePreviewPayload({
        sources,
        filters: [],
        time_window: {
          label: 'custom',
          range: {
            start: moment().subtract(1, 'days').toISOString(),
            end: moment().toISOString()
          }
        }
      });

      console.log('initialData: ', payload);
      previewPrompt(payload);
    }
  }, [pid]);

  // useEffect(() => {
  //   if (filter) {
  //     getData();
  //   }
  // }, [filter]);

  const previewPrompt = (payload: TPayloadOut) => {
    preview({
      workspaceId: wid,
      promptId: pid,
      prompt: payload
    });
  };

  const handleSaveAsExplore = () => {
    setStatus('submitting');
    const payload = generateExplorePayload(wid, pid, user);

    createExploreHandler({ query: createObject, payload: payload });
  };

  const successCb = (data: any) => {
    setStatus('success');
    handleNavigationOnSuccess();
  };

  const errorCb = (error: any) => {
    setStatus('error');
    handleAlertOpen({ message: error, alertType: 'error' as AlertStatus });
  };

  const createExploreHandler = async ({ query, payload }: { query: any; payload: any }) => {
    await queryHandler({ query, payload, successCb, errorCb });
  };

  const handleNavigationOnSuccess = () => {
    router.push(`${getBaseRoute(wid)}/explores`);
  };

  /**
   * Responsible for opening alert dialog.
   */
  const handleAlertOpen = ({ message = '', alertType }: { message: string | any; alertType: AlertStatus }) => {
    setAlertState({
      message: message,
      show: true,
      type: alertType
    });
  };

  /**
   * Responsible for closing alert dialog.
   */
  const handleAlertClose = () => {
    setAlertState({
      message: '',
      show: false,
      type: 'empty'
    });
  };

  const applyFilters = (data: any) => {
    console.log('data', data);
    // preview({
    //   workspaceId: wid,
    //   promptId: pid,
    //   prompt: data
    // });
  };

  return (
    <Paper variant="outlined">
      <AlertComponent
        open={alertState.show}
        onClose={handleAlertClose}
        message={alertState.message}
        isError={alertState.type === 'error'}
      />

      <PromptFilter spec={''} applyFilters={applyFilters} />

      <ContentLayout
        key={`PreviewPage`}
        error={error}
        PageContent={<PageContent data={data} />}
        displayComponent={!error && !isLoading && data}
        isLoading={isLoading}
        traceError={false}
      />
    </Paper>
  );
};

export default PreviewTable;

const PageContent = ({ data }: { data: TData }) => {
  console.log('data:_', data);
  return null;
  if (isDataEmpty(data)) {
    return <ListEmptyComponent description={'No data found for this prompt'} />;
  }

  return <DataTable data={data} />;
};
