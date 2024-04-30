/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Wednesday, May 31st 2023, 12:56:13 pm
 * Author: Nagendra S @ valmi.io
 */

import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { NextPageWithLayout } from '@/pages_app';

import SidebarLayout from '@layouts/SidebarLayout';

import Head from '@components/PageHead';

import { useWorkspaceId } from '@/hooks/useWorkspaceId';

const ConnectionsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const { workspaceId = null } = useWorkspaceId();

  useEffect(() => {
    router.push(`/spaces/${workspaceId}/connections/warehouses`);
  }, []);

  return (
    <>
      <Head />
    </>
  );
};

ConnectionsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export default ConnectionsPage;
