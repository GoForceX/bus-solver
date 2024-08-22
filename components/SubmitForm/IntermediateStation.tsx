import { rem, Stack, TextInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClock, IconX } from '@tabler/icons-react';

import { CustomCard } from '../CustomCard/CustomCard';

export function IntermediateStation({
  stationKey,
  formContext,
  onDelete,
}: {
  stationKey?: number;
  formContext: any;
  onDelete: (stationKey: number) => void;
}) {
  const form = formContext();
  return (
    <>
      <CustomCard
        key={`__station.intermediate.card_${stationKey}`}
        title={`中途站 - ${(stationKey || 0) + 1}`}
        titleEnd={
          <>
            <IconX
              size={16}
              onClick={() => {
                onDelete(stationKey || 0);
              }}
            />
          </>
        }
        collapsible
        withBorder
      >
        <Stack gap="sm" key={`__station.intermediate.stack_${stationKey}`}>
          <TextInput
            label="车站名称"
            withAsterisk
            placeholder="请输入车站名称"
            key={form.key(`station.intermediate.${stationKey}.name`)}
            {...form.getInputProps(`station.intermediate.${stationKey}.name`)}
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
