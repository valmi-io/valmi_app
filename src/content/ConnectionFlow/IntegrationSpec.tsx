import ErrorComponent, { ErrorStatusText } from '@/components/Error';
import SkeletonLoader from '@/components/SkeletonLoader';
import SubmitButton from '@/components/SubmitButton';
import { OAuthContext } from '@/contexts/OAuthContext';
import { RootState } from '@/store/reducers';
import { getSelectedConnectorKey, isConnectionAutomationFlow } from '@/utils/connectionFlowUtils';
import { getCustomRenderers } from '@/utils/form-customRenderers';
import { jsonFormValidator } from '@/utils/form-utils';
import { JsonFormsCore } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Stack } from '@mui/material';
import { useContext } from 'react';
import { useSelector } from 'react-redux';

import spec from './spec.json';

const IntegrationSpec = ({
  error,
  traceError,
  isLoading,
  specData,
  handleSubmit,
  status
}: {
  error: any;
  traceError: any;
  isLoading: boolean;
  specData: any;
  status: string;

  handleSubmit: (payload: any) => void;
}) => {
  const connectionDataFlow = useSelector((state: RootState) => state.connectionDataFlow);

  const selectedConnector = connectionDataFlow.entities[getSelectedConnectorKey()] ?? {};

  const { type = '', mode = '' } = selectedConnector;

  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['auth_method'] });

  const { formState, setFormState } = useContext(OAuthContext);

  const handleFormChange = async ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setFormState(data);
  };

  const getButtonTitle = () => {
    return isConnectionAutomationFlow({ mode, type }) ? 'Create' : 'Check';
  };

  const renderComponent = () => {
    if (error) {
      return <ErrorComponent error={error} />;
    }

    if (traceError) {
      return <ErrorStatusText>{traceError}</ErrorStatusText>;
    }

    if (isLoading) {
      return <SkeletonLoader loading={isLoading} />;
    }

    if (specData) {
      // const schema: any = specData?.spec?.connectionSpecification ?? {};

      // TODO: replace spec with specData
      const schema: any = spec?.spec?.connectionSpecification ?? {};

      const { valid, errors } = jsonFormValidator(schema, formState);

      return (
        <>
          <JsonForms
            readonly={status === 'submitting'}
            schema={schema}
            data={formState}
            renderers={customRenderers}
            cells={materialCells}
            onChange={handleFormChange}
          />
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <SubmitButton
              buttonText={getButtonTitle()}
              data={status === 'success'}
              isFetching={status === 'submitting'}
              disabled={!valid || status === 'submitting'}
              onClick={() => handleSubmit(formState)}
            />
          </Stack>

          {/* <ConnectionCheck key={'ConnectionCheck'} state={state} isDiscovering={isDiscovering} /> */}
        </>
      );
    }
  };

  return <>{renderComponent()}</>;
};

export default IntegrationSpec;