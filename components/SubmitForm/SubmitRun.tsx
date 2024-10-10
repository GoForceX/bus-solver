import {
  Button,
  Flex,
  Group,
  InputLabel,
  Modal,
  rem,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { Checkbox, Radio, Select, TextInput, TimeInput } from 'react-hook-form-mantine';
import { FormProvider, SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { useDisclosure } from '@mantine/hooks';
import { IconClock, IconGripVertical } from '@tabler/icons-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { FormEventHandler, forwardRef, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { plateProvince } from '@/utils/plateValidate';
import { CustomCard } from '../CustomCard/CustomCard';
import { NewRunType } from '@/app/upload/run/types';
import { IntermediateStation } from './IntermediateStation';
import classes from './global.module.css';
import { SearchPOI } from '../Amap/SearchPOI';

export const SubmitRun = forwardRef<
  HTMLFormElement,
  {
    onSubmit: FormEventHandler<HTMLFormElement>;
    onAddStation: (keys: string[]) => void;
    stationList: any[];
    companyList: any[];
  }
>(({ onSubmit, onAddStation, stationList, companyList }, ref) => {
  const [fromStationOpened, { open: setFromStationOpened, close: setFromStationClosed }] =
    useDisclosure(false);
  const [toStationOpened, { open: setToStationOpened, close: setToStationClosed }] =
    useDisclosure(false);
  const [addStationList, setAddStationList] = useState<string[]>([]);

  const form = useFormContext<NewRunType>();

  const data = useWatch({
    control: form.control,
  });

  const addStationListRef = useRef(addStationList);

  useEffect(() => {
    addStationListRef.current = addStationList;
  }, [addStationList]);

  const onSub: SubmitHandler<NewRunType> = (_data) => console.log(_data);

  const { control } = form;

  return (
    <>
      <FormProvider {...form}>
        <CustomCard title="填写班线信息">
          <form ref={ref} id="submitRun" onSubmit={form.handleSubmit(onSub)}>
            <Flex align="stretch" direction="column" justify="center" gap="md">
              <Radio.Group label="选择车牌类型" withAsterisk control={control} name="plate.type">
                <Group
                  mt="xs"
                  styles={{
                    root: {
                      alignItems: 'flex-start',
                    },
                  }}
                >
                  <Radio.Item value="light" label="小车" description="蓝牌 / 绿牌" />
                  <Radio.Item value="heavy" label="大车" description="黄牌 / 黄绿牌" />
                  <Radio.Item value="temp" label="临牌" />
                  <Radio.Item value="other" label="其他" />
                </Group>
              </Radio.Group>
              <TextInput
                label="车牌号"
                placeholder="A12…"
                withAsterisk
                wrapperProps={{
                  onBlur: () => {
                    form.setValue(
                      'plate.number.detail',
                      form.getValues().plate.number.detail.toUpperCase()
                    );
                  },
                }}
                control={control}
                name="plate.number.detail"
                leftSection={
                  form.getValues().plate.type === 'other' ? undefined : (
                    <Select
                      placeholder="—"
                      data={plateProvince}
                      searchable
                      allowDeselect={false}
                      checkIconPosition="right"
                      variant="unstyled"
                      control={control}
                      name="plate.number.province"
                      comboboxProps={{ width: rem(64), position: 'bottom-start' }}
                      styles={{
                        input: {
                          paddingLeft: rem(8),
                          paddingRight: rem(4),
                        },
                      }}
                      rightSectionProps={{
                        style: {
                          paddingLeft: rem(20),
                        },
                      }}
                    />
                  )
                }
                leftSectionWidth={form.getValues().plate.type === 'other' ? undefined : rem(40)}
              />
              <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing={{ base: 10, sm: 'lg' }}
                verticalSpacing="md"
              >
                <div>
                  <InputLabel required>
                    <Group justify="center" align="center" display="inline-flex" gap="md">
                      发站
                      <Checkbox
                        display="inline-block"
                        label="站外发车"
                        control={control}
                        name="station.from.outside"
                      />
                    </Group>
                  </InputLabel>

                  {form.getValues().station.from.outside ? (
                    <Stack gap="xs">
                      {form.getValues().station.from.address.name ? (
                        <Text className={classes.shadedText}>
                          {`已选中: ${form.getValues().station.from.address.name}`}
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
                          name="station.from.nickname"
                        />
                        <Modal
                          size="xl"
                          opened={fromStationOpened}
                          onClose={setFromStationClosed}
                          title="发站位置 - 地图选点"
                        >
                          <SearchPOI
                            onClose={(selected) => {
                              form.setValue('station.from.address.name', selected.name);
                              form.setValue('station.from.address.mapid', selected.id);
                              form.setValue('station.from.address.lon', selected.lon);
                              form.setValue('station.from.address.lat', selected.lat);
                              form.setValue(
                                'station.from.address.administrative',
                                selected.administrative
                              );
                              setFromStationClosed();
                            }}
                          />
                        </Modal>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFromStationOpened();
                          }}
                        >
                          选择位置
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Select
                      withAsterisk
                      data={stationList}
                      placeholder="xxx站"
                      searchable
                      allowDeselect={false}
                      checkIconPosition="right"
                      control={control}
                      name="station.from.stationId"
                    />
                  )}
                </div>

                <div>
                  <InputLabel required>
                    <Group justify="center" align="center" display="inline-flex" gap="md">
                      到站
                      <Checkbox
                        display="inline-block"
                        label="站外终到"
                        control={control}
                        name="station.to.outside"
                      />
                    </Group>
                  </InputLabel>

                  {form.getValues().station.to.outside ? (
                    <Stack gap="xs">
                      {form.getValues().station.to.address.name ? (
                        <Text className={classes.shadedText}>
                          {`已选中: ${form.getValues().station.to.address.name}`}
                        </Text>
                      ) : (
                        <Text className={classes.shadedText} c="red">
                          请点击按钮选择位置
                        </Text>
                      )}
                      <Group preventGrowOverflow={false} wrap="nowrap">
                        <TextInput
                          withAsterisk
                          placeholder="站点别名/简称"
                          style={{ flexGrow: 1 }}
                          control={control}
                          name="station.to.nickname"
                        />
                        <Modal
                          size="xl"
                          opened={toStationOpened}
                          onClose={setToStationClosed}
                          title="到站位置 - 地图选点"
                        >
                          <SearchPOI
                            onClose={(selected) => {
                              form.setValue('station.to.address.name', selected.name);
                              form.setValue('station.to.address.mapid', selected.id);
                              form.setValue('station.to.address.lon', selected.lon);
                              form.setValue('station.to.address.lat', selected.lat);
                              form.setValue(
                                'station.to.address.administrative',
                                selected.administrative
                              );
                              setToStationClosed();
                            }}
                          />
                        </Modal>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setToStationOpened();
                          }}
                        >
                          选择位置
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Select
                      withAsterisk
                      data={stationList}
                      placeholder="xxx站"
                      searchable
                      allowDeselect={false}
                      checkIconPosition="right"
                      control={control}
                      name="station.to.stationId"
                    />
                  )}
                </div>

                <Select
                  withAsterisk
                  placeholder="xxx公司"
                  data={companyList}
                  label="运营公司"
                  searchable
                  allowDeselect={false}
                  checkIconPosition="right"
                  control={control}
                  name="company.id"
                />
                <TextInput
                  placeholder="第x分公司 / 第x车队 / 外包 / ……"
                  label="公司补充说明"
                  control={control}
                  name="company.desc"
                />

                <TimeInput
                  label="发车时间"
                  withAsterisk
                  leftSection={
                    <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  control={control}
                  name="schedule.departTime"
                />

                <Radio.Group
                  label="发车频次"
                  withAsterisk
                  control={control}
                  name="schedule.frequency"
                >
                  <Group mt="xs">
                    <Radio.Item value="daily" label="每日发" />
                    <Radio.Item value="alternate" label="隔日发" />
                    <Radio.Item value="other" label="其他" />
                  </Group>
                </Radio.Group>
              </SimpleGrid>
              {form.getValues().schedule.frequency === 'other' && (
                <TextInput
                  withAsterisk
                  label="班次说明"
                  placeholder="如：周末不发车 / 节假日调整 / ……"
                  control={control}
                  name="schedule.explain"
                />
              )}
              <Checkbox label="流水班" control={control} name="shuttle.enabled" />
              {form.getValues().shuttle.enabled ? (
                <SimpleGrid
                  cols={{ base: 1, sm: 2 }}
                  spacing={{ base: 10, sm: 'lg' }}
                  verticalSpacing="md"
                >
                  <TimeInput
                    label="开始时间"
                    withAsterisk
                    leftSection={
                      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    control={control}
                    name="shuttle.startTime"
                  />
                  <TimeInput
                    label="结束时间"
                    withAsterisk
                    leftSection={
                      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    control={control}
                    name="shuttle.endTime"
                  />
                </SimpleGrid>
              ) : null}
              <Button
                variant="outline"
                onClick={() => {
                  form.setValue('station.intermediate', [
                    ...form.getValues().station.intermediate,
                    {
                      entryId: uuidv4(),
                      address: {
                        name: '',
                        mapid: '',
                        lon: 116.397428,
                        lat: 39.90923,
                        administrative: {
                          province: '110000',
                          city: '110100',
                          district: '110101',
                        },
                      },
                      time: {
                        day: 0,
                        subTime: '',
                      },
                      type: '',
                      stationId: '',
                      nickname: '',
                      remarks: '',
                    },
                  ]);
                }}
              >
                添加中途站点
              </Button>
              <DragDropContext
                onDragEnd={({ destination, source }) => {
                  const errors = form.formState.errors.station?.intermediate;
                  if (destination && errors) {
                    const sourceError = errors[source.index];
                    errors[source.index] = errors[destination.index];
                    errors[destination.index] = sourceError;
                  }

                  form.setValue(
                    'station.intermediate',
                    (() => {
                      if (!destination) {
                        return form.getValues().station.intermediate;
                      }

                      const result = Array.from(form.getValues().station.intermediate);
                      const [removed] = result.splice(source.index, 1);
                      result.splice(destination.index, 0, removed);
                      return result;
                    })()
                  );
                }}
              >
                <Droppable droppableId="dnd-list" direction="vertical">
                  {(provided) => (
                    <Stack {...provided.droppableProps} ref={provided.innerRef}>
                      {form.getValues().station.intermediate.map((_, index) => (
                        <Draggable
                          key={`__intermediate.${index}`}
                          index={index}
                          draggableId={`__intermediate.${index}`}
                        >
                          {(itemProvided) => (
                            <Group
                              justify="space-around"
                              ref={itemProvided.innerRef}
                              {...itemProvided.draggableProps}
                            >
                              <div {...itemProvided.dragHandleProps}>
                                <IconGripVertical
                                  style={{ width: rem(18), height: rem(18) }}
                                  stroke={1.5}
                                />
                              </div>
                              <IntermediateStation
                                style={{
                                  flexGrow: 1,
                                }}
                                stationKey={index}
                                formContext={useFormContext}
                                onDelete={() => {
                                  form.setValue(
                                    'station.intermediate',
                                    form
                                      .getValues()
                                      .station.intermediate.filter((_v, i) => i !== index)
                                  );
                                }}
                              />
                            </Group>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </Stack>
                  )}
                </Droppable>
              </DragDropContext>
            </Flex>
          </form>
          <Text>{JSON.stringify(data)}</Text>
          <Text>{JSON.stringify(form.formState.errors)}</Text>
        </CustomCard>
      </FormProvider>
    </>
  );
});
