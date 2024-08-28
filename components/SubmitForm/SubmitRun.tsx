import {
  Flex,
  Radio,
  Group,
  Text,
  TextInput,
  Select,
  rem,
  SimpleGrid,
  Checkbox,
  Button,
  Input,
  Modal,
  Stack,
} from '@mantine/core';
import { createFormContext } from '@mantine/form';
import { TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconClock, IconGripVertical } from '@tabler/icons-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { plateProvince, plateValidate } from '@/app/upload/run/plateValidate';
import { CustomCard } from '../CustomCard/CustomCard';
import { IntermediateStationType, NewRunType } from '@/app/upload/run/types';
import { IntermediateStation } from './IntermediateStation';
import { SearchPOI } from '../Amap/SearchPOI';

import classes from './global.module.css';

const [FormProvider, useFormContext, useForm] = createFormContext<NewRunType>();

export const SubmitRun = forwardRef<
  HTMLFormElement,
  {
    onSubmit: (values: any) => void;
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

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      plate: {
        number: {
          province: '',
          detail: '',
        },
        type: '',
        otherDesc: '',
      },
      station: {
        from: {
          outside: false,
          id: '',
          nickname: '',
          address: {
            name: '',
            mapid: '',
            lon: 116.397428,
            lat: 39.90923,
            administrative: '',
          },
        },
        intermediate: [] as IntermediateStationType[],
        to: {
          outside: false,
          id: '',
          nickname: '',
          address: {
            name: '',
            mapid: '',
            lon: 116.397428,
            lat: 39.90923,
            administrative: '',
          },
        },
      },
      company: {
        id: '',
        desc: '',
      },
      schedule: {
        departTime: '',
        frequency: '',
        explain: '',
      },
      shuttle: {
        enabled: false,
        startTime: '',
        endTime: '',
      },
    },

    validate: {
      plate: {
        type: (value) => {
          if (!value) {
            return '请选择车牌类型';
          }
          return undefined;
        },
        number: {
          detail: (value, values) => {
            if (!value) {
              return '车牌号不能为空';
            }
            if (values.plate.type === 'other') {
              return undefined;
            }
            if (!values.plate.number.province) {
              return '请选择车牌省份';
            }
            if (value.length !== 6 && value.length !== 7) {
              return '车牌号长度必须为 7-8 位';
            }
            if (!plateValidate(`${values.plate.number.province}${value.toUpperCase()}`)) {
              return '车牌号格式不正确';
            }
            return undefined;
          },
        },
      },
      station: {
        from: {
          id: (value, values) => {
            if (!values.station.from.outside && value.length === 0) {
              return '请选择发站';
            }
            return undefined;
          },
          address: (value, values) => {
            if (values.station.from.outside && values.station.from.id.length === 0) {
              return '请填写发站地址';
            }
            return undefined;
          },
        },
        to: {
          id: (value, values) => {
            if (!values.station.to.outside && value.length === 0) {
              return '请选择到站';
            }
            return undefined;
          },
          address: (value, values) => {
            if (values.station.to.outside && values.station.to.id.length === 0) {
              return '请填写到站地址';
            }
            return undefined;
          },
        },
        intermediate: {
          address: (value) => {
            if (value.name.length === 0) {
              return '请输入车站名称';
            }
            return undefined;
          },
          time: (value, values, path) => {
            const currentIndex = parseInt(path.split('.')[2], 10);
            if (value.length === 0) {
              return '请选择时间';
            }
            if (values.station.intermediate[currentIndex - 1]?.time) {
              const previousTime = values.station.intermediate[currentIndex - 1].time;
              if (value <= previousTime) {
                return '时间应晚于前一站点';
              }
            }
            return undefined;
          },
          type: (value) => {
            if (value.length === 0) {
              return '请输入类型';
            }
            return undefined;
          },
        },
      },
      company: {
        id: (value) => {
          if (value.length === 0) {
            return '请选择运营公司';
          }
          return undefined;
        },
      },
      schedule: {
        departTime: (value) => {
          if (value.length === 0) {
            return '请选择发车时间';
          }
          return undefined;
        },
        frequency: (value) => {
          if (value.length === 0) {
            return '请选择发车频次';
          }
          return undefined;
        },
      },
      shuttle: {
        startTime: (value, values) => {
          if (values.shuttle.enabled && value.length === 0) {
            return '请选择开始时间';
          }
          return undefined;
        },
        endTime: (value, values) => {
          if (values.shuttle.enabled && value.length === 0) {
            return '请选择结束时间';
          }
          return undefined;
        },
      },
    },
  });

  const addStationListRef = useRef(addStationList);

  useEffect(() => {
    addStationListRef.current = addStationList;
  }, [addStationList]);

  const handleStationChange = (key: string, previousValue: string, value: string) => {
    if (value === 'ADD') {
      const newList = [...addStationListRef.current, key];
      newList.sort();
      setAddStationList(newList);
      onAddStation(newList);
    }

    if (previousValue === 'ADD') {
      const newList = addStationListRef.current.filter((v) => v !== key);
      newList.sort();
      setAddStationList(newList);
      onAddStation(newList);
    }
  };

  form.watch('station.from.id', ({ previousValue, value, touched, dirty }) => {
    console.log({ previousValue, value, touched, dirty });
    handleStationChange('from', previousValue, value);
  });

  form.watch('station.to.id', ({ previousValue, value, touched, dirty }) => {
    console.log({ previousValue, value, touched, dirty });
    handleStationChange('to', previousValue, value);
  });

  return (
    <>
      <FormProvider form={form}>
        <CustomCard title="填写班线信息" collapsible>
          <form ref={ref} id="submitRun" onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Flex align="stretch" direction="column" justify="center" gap="md">
              <Radio.Group
                label="选择车牌类型"
                withAsterisk
                key={form.key('plate.type')}
                {...form.getInputProps('plate.type')}
              >
                <Group
                  mt="xs"
                  styles={{
                    root: {
                      alignItems: 'flex-start',
                    },
                  }}
                >
                  <Radio value="light" label="小车" description="蓝牌 / 绿牌" />
                  <Radio value="heavy" label="大车" description="黄牌 / 黄绿牌" />
                  <Radio value="temp" label="临牌" />
                  <Radio value="other" label="其他" />
                </Group>
              </Radio.Group>
              <TextInput
                label="车牌号"
                placeholder="A12…"
                withAsterisk
                wrapperProps={{
                  onBlur: () => {
                    form.setFieldValue(
                      'plate.number.detail',
                      form.getValues().plate.number.detail.toUpperCase()
                    );
                  },
                }}
                key={form.key('plate.number.detail')}
                {...form.getInputProps('plate.number.detail')}
                leftSection={
                  form.getValues().plate.type === 'other' ? undefined : (
                    <Select
                      placeholder="—"
                      data={plateProvince}
                      searchable
                      allowDeselect={false}
                      checkIconPosition="right"
                      variant="unstyled"
                      key={form.key('plate.number.province')}
                      {...form.getInputProps('plate.number.province')}
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
                  <Input.Label required>
                    <Group justify="center" align="center" display="inline-flex" gap="md">
                      发站
                      <Checkbox
                        display="inline-block"
                        label="站外发车"
                        key={form.key('station.from.outside')}
                        {...form.getInputProps('station.from.outside')}
                      />
                    </Group>
                  </Input.Label>

                  {form.getValues().station.from.outside ? (
                    <Stack gap="xs">
                      <Text className={classes.shadedText}>
                        {form.getValues().station.from.address.name
                          ? `已选中: ${form.getValues().station.from.address.name}`
                          : '请点击按钮选择位置'}
                      </Text>
                      <Group preventGrowOverflow={false} wrap="nowrap">
                        <TextInput
                          withAsterisk
                          placeholder="站点别名/简称"
                          style={{ flexGrow: 1 }}
                          key={form.key('station.from.nickname')}
                          {...form.getInputProps('station.from.nickname')}
                        />
                        <Modal
                          size="xl"
                          opened={fromStationOpened}
                          onClose={setFromStationClosed}
                          title="发站位置 - 地图选点"
                        >
                          <SearchPOI
                            onClose={(selected) => {
                              form.setFieldValue('station.from.address.name', selected.name);
                              form.setFieldValue('station.from.address.mapid', selected.id);
                              form.setFieldValue('station.from.address.lon', selected.lon);
                              form.setFieldValue('station.from.address.lat', selected.lat);
                              form.setFieldValue('station.from.address.administrative', selected.administrative);
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
                      key={form.key('station.from.id')}
                      {...form.getInputProps('station.from.id')}
                    />
                  )}
                </div>

                <div>
                  <Input.Label required>
                    <Group justify="center" align="center" display="inline-flex" gap="md">
                      到站
                      <Checkbox
                        display="inline-block"
                        label="站外终到"
                        key={form.key('station.to.outside')}
                        {...form.getInputProps('station.to.outside')}
                      />
                    </Group>
                  </Input.Label>

                  {form.getValues().station.to.outside ? (
                    <Stack gap="xs">
                      <Text className={classes.shadedText}>
                        {form.getValues().station.to.address.name
                          ? `已选中: ${form.getValues().station.to.address.name}`
                          : '请点击按钮选择位置'}
                      </Text>
                      <Group preventGrowOverflow={false} wrap="nowrap">
                        <TextInput
                          withAsterisk
                          placeholder="站点别名/简称"
                          style={{ flexGrow: 1 }}
                          key={form.key('station.to.nickname')}
                          {...form.getInputProps('station.to.nickname')}
                        />
                        <Modal
                          size="xl"
                          opened={toStationOpened}
                          onClose={setToStationClosed}
                          title="到站位置 - 地图选点"
                        >
                          <SearchPOI
                            onClose={(selected) => {
                              form.setFieldValue('station.to.address.name', selected.name);
                              form.setFieldValue('station.to.address.mapid', selected.id);
                              form.setFieldValue('station.to.address.lon', selected.lon);
                              form.setFieldValue('station.to.address.lat', selected.lat);
                              form.setFieldValue('station.to.address.administrative', selected.administrative);
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
                      key={form.key('station.to.id')}
                      {...form.getInputProps('station.to.id')}
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
                  key={form.key('company.id')}
                  {...form.getInputProps('company.id')}
                />
                <TextInput
                  placeholder="第x分公司 / 第x车队 / 外包 / ……"
                  label="公司补充说明"
                  key={form.key('company.desc')}
                  {...form.getInputProps('company.desc')}
                />

                <TimeInput
                  label="发车时间"
                  withAsterisk
                  leftSection={
                    <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  key={form.key('schedule.departTime')}
                  {...form.getInputProps('schedule.departTime')}
                />

                <Radio.Group
                  label="发车频次"
                  withAsterisk
                  key={form.key('schedule.frequency')}
                  {...form.getInputProps('schedule.frequency')}
                >
                  <Group mt="xs">
                    <Radio value="daily" label="每日发" />
                    <Radio value="alternate" label="隔日发" />
                    <Radio value="other" label="其他" />
                  </Group>
                </Radio.Group>
              </SimpleGrid>
              {form.getValues().schedule.frequency === 'other' ? (
                <TextInput
                  withAsterisk
                  label="班次说明"
                  placeholder="如：周末不发车 / 节假日调整 / ……"
                  key={form.key('schedule.explain')}
                  {...form.getInputProps('schedule.explain')}
                />
              ) : null}
              <Checkbox
                label="流水班"
                key={form.key('shuttle.enabled')}
                {...form.getInputProps('shuttle.enabled')}
              />
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
                    key={form.key('shuttle.startTime')}
                    {...form.getInputProps('shuttle.startTime')}
                  />
                  <TimeInput
                    label="结束时间"
                    withAsterisk
                    leftSection={
                      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    key={form.key('shuttle.endTime')}
                    {...form.getInputProps('shuttle.endTime')}
                  />
                </SimpleGrid>
              ) : null}
              <Button
                variant="outline"
                onClick={() => {
                  form.setFieldValue('station.intermediate', [
                    ...form.getValues().station.intermediate,
                    {
                      address: {
                        name: '',
                        mapid: '',
                        lon: 116.397428,
                        lat: 39.90923,
                        administrative: '',
                      },
                      time: '',
                      type: '',
                      id: '',
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
                  form.setFieldValue(
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
                  form.setTouched({ 'station.intermediate': true });
                  // verify all fields
                  form.getValues().station.intermediate.forEach((_, index) => {
                    form.validateField(`station.intermediate.${index}.name`);
                    form.validateField(`station.intermediate.${index}.time`);
                    form.validateField(`station.intermediate.${index}.type`);
                  });
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
                                  form.setFieldValue(
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
        </CustomCard>
      </FormProvider>
    </>
  );
});
