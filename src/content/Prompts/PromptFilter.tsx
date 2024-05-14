import { getCustomRenderers } from '@/utils/form-customRenderers';
import { jsonFormValidator } from '@/utils/form-utils';
import { Generate, JsonFormsCore } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { Card, Paper, Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import { schema } from '@content/Prompts/promptUtils';
import SubmitButton from '@/components/SubmitButton';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';

const PromptFilter = ({ spec, applyFilters }: { spec: any; applyFilters: (data: any) => void }) => {
  let initialData = {};

  const [data, setData] = useState<any>(initialData);
  // customJsonRenderers
  const customRenderers = getCustomRenderers({ invisibleFields: ['bulk_window_in_days'] });

  const { valid, errors } = jsonFormValidator(schema, data);

  const handleFormChange = ({ data }: Pick<JsonFormsCore, 'data' | 'errors'>) => {
    setData(data);
  };

  const customUISchema = useMemo(() => {
    const uischema = Generate.uiSchema(schema);
    uischema['type'] = 'HorizontalLayout';
    return uischema;
  }, [schema]);

  const handleOnClick = () => {
    let obj = data;
    if (!data?.filters) {
      obj.filters = [];
    }
    applyFilters(obj);
 
  };

  return (
    <Paper variant="outlined">
      <JsonForms
        schema={schema}
        uischema={customUISchema}
        data={data}
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
          buttonText={'Apply filters'}
          data={false}
          isFetching={false}
          disabled={!valid}
          onClick={handleOnClick}
        />
      </Stack>
    </Paper>
  );
};

export default PromptFilter;