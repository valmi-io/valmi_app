import { useRouter } from 'next/router';

import { Table, TableBody, TableHead, TableContainer, Paper } from '@mui/material';

import TableHeader from '@components/Table/TableHeader';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { CredentialsColumns } from '@/content/Credentials/CredentialsTableColumns';
import CredentialsTableRow from '@/content/Credentials/CredentialsTableRow';
import { TCredential } from '@/utils/typings.d';
import { getCredentialObjKey, getSelectedConnectorKey, getSelectedConnectorObj } from '@/utils/connectionFlowUtils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { redirectToCreateConnection } from '@/utils/router-utils';

export interface SyncOnClickProps {
  syncId: string;
}

const CredentialsTable = ({ credentials }: { credentials: TCredential[] }) => {
  console.log('Credentials', credentials);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const handleCredentialEdit = ({ credential }: { credential: TCredential }) => {
    console.log('handle on click:_', credential);
    // redirect to connections/create page.
    // router.push(`/spaces/${workspaceId}/connections/create`);

    // const { connector_type="", connector_config={} } = credential;

    const key = getSelectedConnectorKey();

    const { account = {}, connector_config = {}, name: sourceCredentialName = '', ...item } = credential ?? {};

    const obj = getSelectedConnectorObj(item, key);

    const objToDispatch = {
      ids: [key, getCredentialObjKey(obj.type)],
      entities: {
        [key]: getSelectedConnectorObj(item, key),
        [getCredentialObjKey(obj.type)]: {
          config: {
            ...connector_config,
            name: sourceCredentialName
          }
        }
      }
    };

    console.log('obj to dispatch: ', objToDispatch);

    dispatch(setConnectionFlowState(objToDispatch));

    redirectToCreateConnection({ router: router, wid: workspaceId });
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableHeader columns={CredentialsColumns} />
        </TableHead>
        <TableBody>
          {credentials.map((credential: TCredential) => {
            return <CredentialsTableRow key={credential.id} credential={credential} onClick={handleCredentialEdit} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CredentialsTable;