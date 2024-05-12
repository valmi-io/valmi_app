// @ts-nocheck
/*
 * Copyright (c) 2024 valmi.io <https://github.com/valmi-io>
 * Created Date: Monday, May 22nd 2023, 2:52:54 pm
 * Author: Nagendra S @ valmi.io
 */

import React, { useState } from 'react';

import { Box, styled, Stack, Typography, Paper } from '@mui/material';

import ImageComponent, { ImageSize } from '@components/ImageComponent';
import FormControlComponent from '@/components/FormControlComponent';
import { getCustomRenderers } from '@/utils/form-customRenderers';

const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    promotion: {
      type: 'boolean',
      title: 'Check to receive latest product updates over email',
      default: false
    },
    role: {
      type: 'string',
      title: 'You are part of',
      enum: ['Engineering', 'Marketing', 'Other'],
      enumNames: ['Engineering', 'Marketing', 'Other']
    }
  },
  required: ['promotion', 'meta']
};

const ContainerLayout = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '648px',
  height: '364.25px',
  padding: theme.spacing(2, 8, 2, 8),
  gap: theme.spacing,
  border: '1px solid rgba(0, 0, 0, 0.25)'
}));

const TextLayout = styled(Typography)(({ theme }) => ({
  color: theme.colors.primary.dark,
  display: 'block'
}));

const FormLayout = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 0, 1, 0)
}));

const AuthenticationLayout = (props) => {
  const initialData = {};
  const [data, setData] = useState<any>(initialData);
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };
  return (
    <ContainerLayout>
      {/** valmi - logo */}
      <Stack alignItems="center">
        <ImageComponent src={'/images/valmi_logo_text_black.svg'} alt="Logo" size={ImageSize.logo} />
      </Stack>
      <TextLayout variant="body1">
        Create your free Valmi account using your Google account. Sync your eCommerce data to Google Sheets, analyze and
        engage with your customers.
      </TextLayout>
      <FormLayout>
        <FormControlComponent
          key={`signInPage`}
          editing={false}
          onFormChange={handleFormChange}
          error={false}
          jsonFormsProps={{ data: data, schema: schema, renderers: customRenderers }}
          removeAdditionalFields={false}
          displayActionButton={false}
          disabled={false}
        />
        {props.children}
      </FormLayout>
    </ContainerLayout>
  );
};

export default AuthenticationLayout;
