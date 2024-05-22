import CustomCard from '@/components/CustomCard';
import CustomIcon from '@/components/Icon/CustomIcon';
import ImageComponent, { ImageSize } from '@/components/ImageComponent';
import appIcons from '@/utils/icon-utils';
import { Chip, Grid, IconButton, Tooltip, styled } from '@mui/material';
import { useMemo } from 'react';

export type TPromptSource = { id: string; name: string };

export type TPromptSchema = { id: string; name: string; sources: TPromptSource[] };

export type TPrompt = {
  id: string;
  name: string;
  gated: boolean;
  package_id: string;
  query: string;
  schemas: TPromptSchema[];
  spec: any;
  table: string;
  type: string;
  description: string;
};

export const PromptFilterChip = styled(Chip)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
  borderRadius: 4,
  backgroundColor: '#E55837'
}));

type TPromptProps = {
  item: TPrompt;
  handleOnClick: (item: TPrompt) => void;
};

const PromptCard = ({ item, handleOnClick }: TPromptProps) => {
  const { description, name } = item ?? {};

  const icon = useMemo(() => {
    const integrationType: string = item?.type?.split('_').slice(1).join('_') ?? '';

    return `/connectors/${integrationType.toLowerCase()}.svg`;
  }, [item.type]);

  return (
    <Grid item xs={'auto'}>
      <CustomCard
        startIcon={<ImageComponent src={icon} alt="connector" size={ImageSize.medium} />}
        endIcon={
          <Tooltip title="">
            <IconButton sx={{ ml: 2 }} color="primary" onClick={() => handleOnClick(item)}>
              <CustomIcon style={{ fontSize: ImageSize.medium }} icon={appIcons.CIRCLE_PLUS_OUTLINED} />
            </IconButton>
          </Tooltip>
        }
        title={name}
        desc={description}
      />
    </Grid>
  );
};

export default PromptCard;