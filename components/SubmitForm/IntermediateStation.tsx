import {
  Button,
  Group,
  Input,
  Modal,
  Radio,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconClock, IconX } from '@tabler/icons-react';
import { UseFormReturnType } from '@mantine/form';
import { forwardRef } from 'react';

import { CustomCard } from '../CustomCard/CustomCard';
import { SearchPOI } from '../Amap/SearchPOI';
import { NewRunType } from '@/app/upload/run/types';

import classes from './global.module.css';

export const IntermediateStation = forwardRef<
  HTMLDivElement,
  {
    stationKey?: number;
    formContext: () => UseFormReturnType<NewRunType, (values: NewRunType) => NewRunType>;
    style?: any;
    onDelete: (stationKey: number) => void;
  }
>(({ stationKey = 1, formContext, style, onDelete }, ref) => {
  const form = formContext();
  const [stationOpened, { open: setStationOpened, close: setStationClosed }] = useDisclosure(false);

  const mockStationList = [
    { value: 'S13100001', label: '（河北省廊坊市）廊坊客运总站' },
    { value: 'S11000001', label: '（北京市）六里桥客运主枢纽' },
    { value: 'ADD', label: '+ 添加新站' },
  ];

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

          <div>
            <Input.Label required>车站名称</Input.Label>
            {form.getValues().station.intermediate[stationKey].type ? (
              form.getValues().station.intermediate[stationKey].type === 'station' ? (
                <Select
                  withAsterisk
                  data={mockStationList}
                  placeholder="xxx站"
                  searchable
                  allowDeselect={false}
                  checkIconPosition="right"
                  key={form.key(`station.intermediate.${stationKey}.address.id`)}
                  {...form.getInputProps(`station.intermediate.${stationKey}.address.id`)}
                />
              ) : (
                <Group grow preventGrowOverflow={false}>
                  <TextInput
                    withAsterisk
                    placeholder="请点击右侧按钮选择位置"
                    disabled
                    key={form.key(`station.intermediate.${stationKey}.address.name`)}
                    {...form.getInputProps(`station.intermediate.${stationKey}.address.name`)}
                  />
                  <Modal
                    size="xl"
                    opened={stationOpened}
                    onClose={setStationClosed}
                    title="中途站位置 - 地图选点"
                  >
                    <SearchPOI
                      onClose={(selected) => {
                        form.setFieldValue(
                          `station.intermediate.${stationKey}.address.name`,
                          selected.name
                        );
                        form.setFieldValue(
                          `station.intermediate.${stationKey}.address.mapid`,
                          selected.id
                        );
                        form.setFieldValue(
                          `station.intermediate.${stationKey}.address.lat`,
                          selected.lat
                        );
                        form.setFieldValue(
                          `station.intermediate.${stationKey}.address.lon`,
                          selected.lon
                        );
                        setStationClosed();
                      }}
                    />
                  </Modal>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStationOpened();
                    }}
                  >
                    选择位置
                  </Button>
                </Group>
              )
            ) : (
              <Text className={classes.shadedText}>请先选择车站类型</Text>
            )}
          </div>

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
