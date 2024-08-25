import { Group, Radio, rem, Stack, TextInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { IconClock, IconX } from '@tabler/icons-react';
import { forwardRef } from 'react';

import { CustomCard } from '../CustomCard/CustomCard';

export const IntermediateStation = forwardRef<
  HTMLDivElement,
  {
    stationKey?: number;
    formContext: any;
    style?: any;
    onDelete: (stationKey: number) => void;
  }
>(({ stationKey, formContext, style, onDelete }, ref) => {
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
        ref={ref}
        style={style}
      >
        <Stack gap="sm" key={`__station.intermediate.stack_${stationKey}`}>
          <Radio.Group
            label="类型"
            withAsterisk
            key={form.key(`station.intermediate.${stationKey}.type`)}
            {...form.getInputProps(`station.intermediate.${stationKey}.type`)}
          >
            <Group mt="xs">
              <Radio value="station" label="站内" />
              <Radio value="outside" label="站外" />
              <Radio value="serviceArea" label="服务区" />
              <Radio value="restSite" label="社会休息点" />
              <Radio value="other" label="其他" />
            </Group>
          </Radio.Group>
          <TextInput
            label="车站名称"
            withAsterisk
            placeholder="请输入车站名称"
            key={form.key(`station.intermediate.${stationKey}.address.name`)}
            {...form.getInputProps(`station.intermediate.${stationKey}.address.name`)}
          />
          <TimeInput
            label="时间"
            withAsterisk
            leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            key={form.key(`station.intermediate.${stationKey}.time`)}
            {...form.getInputProps(`station.intermediate.${stationKey}.time`)}
          />
        </Stack>
      </CustomCard>
    </>
  );
});
