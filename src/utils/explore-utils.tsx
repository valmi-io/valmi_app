import { generateAccountPayload } from '@/utils/account-utils';

export const generateExplorePayload = (wid: string, pid: string, user: any) => {
  return {
    workspaceId: wid,
    explore: {
      name: '',
      prompt_id: pid,
      spreadsheet_url: 'https://www.abcd.com',
      ready: false,
      account: generateAccountPayload(user)
    }
  };
};

const promptFilters = [
  { val: 7, name: 'Last 7 days' },
  { val: 15, name: 'Last 15 days' },
  { val: 30, name: 'Last 30 days' },
  { val: 90, name: 'Last 90 days' },
  { val: 60, name: 'Last 2 months' }
];

export const getPromptFilter = (filter: string) => {
  //@ts-ignore
  const { val } = promptFilters.find((item) => filter === item.name);

  return val;
};
