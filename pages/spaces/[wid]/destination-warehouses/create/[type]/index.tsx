/*
 * Copyright (c) 2023 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, December 27th 2023, 11:41:47 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { ReactElement, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

import PageLayout from '@layouts/PageLayout';
import SidebarLayout from '@layouts/SidebarLayout';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getDestinationSelectors, getStreamSelectors, useCreateDestinationMutation, useCreateStreamMutation, useDeleteDestinationMutation, useDeleteStreamMutation, useDestinationSchemaQuery, useEditDestinationMutation, useEditStreamMutation, useGetStreamsQuery, useStreamSchemaQuery } from '@store/api/streamApiSlice';
import { RootState } from '@store/reducers';
import { Box, Button, Card, Grid, IconButton } from '@mui/material';
import ErrorContainer from '@components/Error/ErrorContainer';
import SkeletonLoader from '@components/SkeletonLoader';
import ratingControlTester from '../../../../../../src/tmp/ratingControlTester';
import StreamKeysControl from '../../../../../../src/tmp/StreamKeysControl';
import { Generate, JsonSchema, TesterContext, UISchemaElement, createAjv, rankWith } from '@jsonforms/core';
import InputControl from '../../../../../../src/tmp/InputControl';
import InvisibleControl from '../../../../../../src/tmp/InvisibleControl';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation';
import { isTrue } from '../../../../../../src/utils/lib';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage';
import FontAwesomeIcon from '../../../../../../src/components/Icon/FontAwesomeIcon';
import appIcons from '../../../../../../src/utils/icon-utils';

const invisibleProperties = ['id', 'workspaceId', 'type', 'provisioned', 'testConnectionError', 'destinationType'];
const invisiblePropertiesTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  return invisibleProperties.some((prop) => uischema.scope.endsWith(prop));
};

const apiKeys = ['publicKeys', 'privateKeys'];
const apiKeysTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  return apiKeys.some((prop) => uischema.scope.endsWith(prop));
};

const inputControlTester = (uischema: any, schema: JsonSchema, context: TesterContext) => {
  if (uischema.type !== 'Control') return false;
  //simple hack to get the control name. //TODO: find a better way
  const arr = uischema.scope.split('/');
  const controlName = arr[arr.length - 1];
  // console.log(controlName);
  const dataType = schema?.properties?.[controlName]?.type;
  // console.log(dataType);

  if (dataType === 'string' || dataType === 'number') return true;
  return false;
};

const renderers = [
  ...materialRenderers,
  {
    tester: rankWith(
      4000, //increase rank as needed
      apiKeysTester
    ),
    renderer: StreamKeysControl
  },
  {
    tester: rankWith(
      3000, //increase rank as needed
      invisiblePropertiesTester
    ),
    renderer: InvisibleControl
  },
  {
    tester: rankWith(
      2000, //increase rank as needed
      inputControlTester
    ),
    renderer: InputControl
  }
];

const jsonFormValidator = (schema: any, data: any) => {
  const ajv = createAjv({ useDefaults: true });
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    return {
      valid: false,
      errors: (validate as any).errors.map((error: any) => {
        return {
          message: error.message,
          path: error.dataPath
        };
      })
    };
  }
  return { valid: true, errors: [] };
};

const CreateDestinationXterior = () => {

  // Get type from router
  const router = useRouter();
  const { type } = router.query;
  if (!type) return <></>;
  else return <CreateDestination  type={type}/>;

};

const CreateDestination = ({type} : any) => {
  const appState = useSelector((state: RootState) => state.appFlow.appState);
  const { workspaceId = '' } = appState;

  // Getting schema for the object
  const { data: schema, isLoading, isSuccess, isError, error } = useDestinationSchemaQuery({workspaceId, type});

  // Getting from redux to decide creating/editing
  const {editing, id: destinationId, type: xtype, supertype} = useSelector((state: RootState) => state.destinationFlow);

  // Getting stream selectors for editing case specifically - not useful for create case
  const { selectAllDestinations, selectDestinationById } = getDestinationSelectors(workspaceId as string);
  const destinationData = useSelector((state) => selectDestinationById(state, destinationId));

  let initialData = {
    id: uuidv4(),
    type: 'destination',
    workspaceId: workspaceId,
    name: '',
    destinationType: type, //Sorry for the confusion - our type is jitsu destinationType and our supertype is jitsu type
  };

  if (isTrue(editing)) {
    initialData = destinationData;
  }

  const [data, setData] = useState<any>(initialData);

  // Mutation for creating Schema object
  const [createObject, { isLoading: isCreating, isSuccess: isCreated, isError: isCreateError, error: createError }] = useCreateDestinationMutation();

  // Mutation for editing Schema object
  const [editObject, { isLoading: isEditing, isSuccess: isEdited, isError: isEditError, error: editError }] = useEditDestinationMutation();

  // Mutation for deleting Schema object
  const [deleteObject, { isLoading: isDeleting, isSuccess: isDeleted, isError: isDeleteError, error: deleteError }] = useDeleteDestinationMutation();

  const PageContent = () => {
    //   const uiSchema = Generate.uiSchema(schema);
    //   uiSchema.elements[7].options = {  detail : 'REGISTERED' };
    //   console.log(uiSchema);

    const { valid, errors } = jsonFormValidator(schema, data);

    return (
      <Box margin={10}>
        {editing &&
          <IconButton onClick={()=>deleteObject({ workspaceId: workspaceId,  destinationId: destinationId })}>
                <FontAwesomeIcon icon={appIcons.UPLOAD} />
          </IconButton>
        }
        <JsonForms
          schema={schema}
          //uischema={uiSchema}
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={({ errors, data }) => setData(data)}
        />
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <Button
          variant="contained"
          color="primary"
          disabled={isCreating || isEditing || !valid}
          onClick={() => (editing ? editObject({ workspaceId: workspaceId, destination: data }) : createObject({ workspaceId: workspaceId, destination: data }))}
        >
          Submit{' '}
        </Button>
        <pre>{errors.length > 0 && JSON.stringify(errors, null, 2)}</pre>
        <pre>{isCreateError && JSON.stringify(createError, null, 2)}</pre>
      </Box>
    );
  };
  return (
    <PageLayout pageHeadTitle={editing ? 'Edit Destination' : 'Create Destination'} title={editing ? 'Edit Destination' : 'Create a new Destination'} displayButton={false}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            {/** Display error */}
            {isError && <ErrorContainer error={error} />}

            {/** Display trace error
              {traceError && <ErrorStatusText>{traceError}</ErrorStatusText>}*/}

            {/** Display skeleton */}
            <SkeletonLoader loading={isLoading} />

            {/** Display page content */}
            {!error && !isLoading && schema && <PageContent />}
          </Card>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

CreateDestinationXterior.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default CreateDestinationXterior;