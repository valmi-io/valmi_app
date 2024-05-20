import { useDispatch } from 'react-redux';

import ConnectorsList, { ConnectorType } from '@/content/ConnectionFlow/Connectors/ConnectorsList';
import { useRouter } from 'next/router';
import { getBaseRoute } from '@/utils/lib';
import { AppDispatch } from '@/store/store';
import { setConnectionFlowState } from '@/store/reducers/connectionDataFlow';
import { getOAuthObjInStore, getSelectedConnectorKey, getSelectedConnectorObj } from '@/utils/connectionFlowUtils';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';

interface ConnectorListProps {
  data: any;
}

const ConnectorsPageContent = ({ data }: ConnectorListProps) => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const { workspaceId = '' } = useWorkspaceId();

  const handleItemOnClick = (item: ConnectorType) => {
    const pathname = `${getBaseRoute(workspaceId as string)}/connections/create`;
    const key = getSelectedConnectorKey();

    const objToDispatch = {
      ids: [key],
      entities: {
        [key]: { ...getSelectedConnectorObj(item, key), ...getOAuthObjInStore(item) } // initially setting oauth_params, oauth_error to empty in store
      }
    };

    dispatch(setConnectionFlowState(objToDispatch));

    router.push(pathname);
  };

  return <ConnectorsList key={`connectorsList`} data={data} handleItemOnClick={handleItemOnClick} selectedType={''} />;
};

export default ConnectorsPageContent;
