import { rem, Stack, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';

import { CustomCard } from '../CustomCard/CustomCard';

export function IntermediateStation({
  stationKey,
  form,
}: {
  stationKey?: string;
  form: UseFormReturnType<any>;
}) {
  return (
    <>
      <CustomCard title={`中途站 - ${stationKey}`} collapsible withBorder>
        <Stack gap="sm">
          <TextInput
            label="车站名称"
            withAsterisk
            placeholder="请输入车站名称"
            key={form.key(`station.intermediate.${stationKey}.station`)}
            {...form.getInputProps('')}
          />
          <TimeInput
            label="时间"
            withAsterisk
            leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            key={form.key(`station.intermediate.${stationKey}.time`)}
            {...form.getInputProps(`station.intermediate.${stationKey}.time`)}
          />
          <TextInput
            id="type"
            label="类型"
            withAsterisk
            placeholder="请输入类型"
            key={form.key(`station.intermediate.${stationKey}.type`)}
            {...form.getInputProps(`station.intermediate.${stationKey}.type`)}
          />
        </Stack>
      </CustomCard>
    </>
  );
}
