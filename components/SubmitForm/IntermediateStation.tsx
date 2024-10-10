import {
  Group,
  Text,
  rem,
  Button,
  Modal,
  Stack,
  InputLabel,
  InputWrapper,
  Space,
} from '@mantine/core';
import {
  Radio,
  TextInput,
  Select,
  TimeInput,
  Textarea,
  NumberInput,
} from 'react-hook-form-mantine';
import { useDisclosure } from '@mantine/hooks';
import { IconClock, IconX } from '@tabler/icons-react';
import { UseFormReturn } from 'react-hook-form';
import { forwardRef } from 'react';

import { CustomCard } from '../CustomCard/CustomCard';
import { SearchPOI } from '../Amap/SearchPOI';
import { NewRunType } from '@/app/upload/run/types';

import classes from './global.module.css';

export const IntermediateStation = forwardRef<
  HTMLDivElement,
  {
    stationKey?: number;
    formContext: () => UseFormReturn<NewRunType, (values: NewRunType) => NewRunType>;
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

  const { control } = form;

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
            control={control}
            name={`station.intermediate.${stationKey}.type`}
          >
            <Group mt="xs">
              <Radio.Item value="station" label="站内" />
              <Radio.Item value="outside" label="站外" />
              <Radio.Item value="serviceArea" label="服务区" />
              <Radio.Item value="restSite" label="社会休息点" />
              <Radio.Item value="other" label="其他" />
            </Group>
          </Radio.Group>

          {form.getValues().station.intermediate[stationKey].type && (
            <div>
              <InputLabel required>车站名称</InputLabel>
              {form.getValues().station.intermediate[stationKey].type ? (
                form.getValues().station.intermediate[stationKey].type === 'station' ? (
                  <Select
                    withAsterisk
                    data={mockStationList}
                    placeholder="xxx站"
                    searchable
                    allowDeselect={false}
                    checkIconPosition="right"
                    control={control}
                    name={`station.intermediate.${stationKey}.stationId`}
                  />
                ) : (
                  <Stack gap="xs">
                    {form.getValues().station.intermediate[stationKey].address.name ? (
                      <Text className={classes.shadedText}>
                        {`已选中: ${form.getValues().station.intermediate[stationKey].address.name}`}
                      </Text>
                    ) : (
                      <Text className={classes.shadedText} c="red">
                        请点击按钮选择位置
                      </Text>
                    )}
                    <Group preventGrowOverflow={false} wrap="nowrap" align="start">
                      <TextInput
                        withAsterisk
                        placeholder="站点别名/简称"
                        style={{ flexGrow: 1 }}
                        control={control}
                        name={`station.intermediate.${stationKey}.nickname`}
                      />
                      <Modal
                        size="xl"
                        opened={stationOpened}
                        onClose={setStationClosed}
                        title="中途站位置 - 地图选点"
                      >
                        <SearchPOI
                          onClose={(selected) => {
                            form.setValue(
                              `station.intermediate.${stationKey}.address.name`,
                              selected.name
                            );
                            form.setValue(
                              `station.intermediate.${stationKey}.address.mapid`,
                              selected.id
                            );
                            form.setValue(
                              `station.intermediate.${stationKey}.address.lat`,
                              selected.lat
                            );
                            form.setValue(
                              `station.intermediate.${stationKey}.address.lon`,
                              selected.lon
                            );
                            form.setValue(
                              `station.intermediate.${stationKey}.address.administrative`,
                              selected.administrative
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
                  </Stack>
                )
              ) : (
                <Text className={classes.shadedText} c="red">
                  请先选择车站类型
                </Text>
              )}
            </div>
          )}

          <InputWrapper label="时间" withAsterisk>
            <Group gap={0} preventGrowOverflow={false}>
              +
              <NumberInput
                name={`station.intermediate.${stationKey}.time.day`}
                control={control}
                style={{ width: rem(64) }}
                min={0}
                max={9}
              />
              天
              <Space w={rem(16)} />
              <TimeInput
                style={{ flexGrow: 1 }}
                leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                control={control}
                name={`station.intermediate.${stationKey}.time.subTime`}
              />
            </Group>
          </InputWrapper>

          <Textarea
            label="备注"
            autosize
            minRows={1}
            control={control}
            name={`station.intermediate.${stationKey}.remarks`}
          />
        </Stack>
      </CustomCard>
    </>
  );
});
