import { Flex } from '@mantine/core';
import { useForm } from '@mantine/form';

import { CustomCard } from '../CustomCard/CustomCard';

export function SubmitStation({
  stationKey,
  suffix,
  onSubmit,
}: {
  stationKey?: string;
  suffix?: string;
  onSubmit: (values: any) => void;
}) {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {},
  });

  return (
    <>
      <CustomCard title={`填写车站信息${suffix ? ` - ${suffix}` : ''}`} collapsible>
        <form id="submitStation" onSubmit={form.onSubmit((values) => onSubmit(values))}>
          <Flex align="stretch" direction="column" justify="center" gap="md"></Flex>
        </form>
      </CustomCard>
    </>
  );
}
