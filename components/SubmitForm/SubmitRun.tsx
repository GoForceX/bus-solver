import {
  Flex,
  Group,
  Text,
  rem,
  SimpleGrid,
  Button,
  Modal,
  Stack,
  InputLabel,
} from '@mantine/core';
import { Radio, TextInput, Select, Checkbox, TimeInput } from 'react-hook-form-mantine';
import { FormProvider, useFormContext, SubmitHandler, useWatch } from 'react-hook-form';
import { useDisclosure } from '@mantine/hooks';
import { IconClock, IconGripVertical } from '@tabler/icons-react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { FormEventHandler, forwardRef, useEffect, useRef, useState } from 'react';

import { plateProvince } from '@/app/upload/run/plateValidate';
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

  // validate: {
  //   plate: {
  //     type: (value) => {
  //       if (!value) {
  //         return '请选择车牌类型';
  //       }
  //       return undefined;
  //     },
  //     number: {
  //       province: (value, values) => {
  //         if (values.plate.type === 'other') {
  //           return undefined;
  //         }
  //         if (value.length === 0) {
  //           form.setFieldError('plate.number.detail', '请选择车牌省份');
  //         }
  //         return undefined;
  //       },
  //       detail: (value, values) => {
  //         if (!value) {
  //           return '车牌号不能为空';
  //         }
  //         if (values.plate.type === 'other') {
  //           return undefined;
  //         }
  //         if (!values.plate.number.province) {
  //           return '请选择车牌省份';
  //         }
  //         if (value.length !== 6 && value.length !== 7) {
  //           return '车牌号长度必须为 7-8 位';
  //         }
  //         if (!plateValidate(`${values.plate.number.province}${value.toUpperCase()}`)) {
  //           return '车牌号格式不正确';
  //         }
  //         return undefined;
  //       },
  //     },
  //   },
  //   station: {
  //     from: {
  //       id: (value, values) => {
  //         if (!values.station.from.outside && value.length === 0) {
  //           return '请选择发站';
  //         }
  //         return undefined;
  //       },
  //       address: (value, values) => {
  //         if (values.station.from.outside && values.station.from.address.name.length === 0) {
  //           return '请填写发站地址';
  //         }
  //         return undefined;
  //       },
  //     },
  //     to: {
  //       id: (value, values) => {
  //         if (!values.station.to.outside && value.length === 0) {
  //           return '请选择到站';
  //         }
  //         return undefined;
  //       },
  //       address: (value, values) => {
  //         if (values.station.to.outside && values.station.to.address.name.length === 0) {
  //           return '请填写到站地址';
  //         }
  //         return undefined;
  //       },
  //     },
  //     intermediate: {
  //       id: (value, values, path) => {
  //         const currentIndex = parseInt(path.split('.')[2], 10);
  //         if (
  //           values.station.intermediate[currentIndex].type === 'station' &&
  //           value.length === 0
  //         ) {
  //           return '请选择中途车站';
  //         }
  //         return undefined;
  //       },
  //       address: (value, values, path) => {
  //         const currentIndex = parseInt(path.split('.')[2], 10);
  //         if (
  //           values.station.intermediate[currentIndex].type !== 'station' &&
  //           value.name.length === 0
  //         ) {
  //           return '请输入车站名称';
  //         }
  //         return undefined;
  //       },
  //       time: (value, values, path) => {
  //         const currentIndex = parseInt(path.split('.')[2], 10);
  //         if (value.subTime.length === 0) {
  //           form.setFieldError(`station.intermediate.${currentIndex}.time.subTime`, '请选择时间');
  //           return '请选择时间';
  //         }
  //         if (currentIndex === 0) {
  //           if (value.day === 0 && value.subTime <= values.schedule.departTime) {
  //             form.setFieldError(
  //               `station.intermediate.${currentIndex}.time.subTime`,
  //               '时间应晚于前一站点'
  //             );
  //             return '时间应晚于前一站点';
  //           }
  //         }
  //         if (values.station.intermediate[currentIndex - 1]?.time) {
  //           const previousTime = values.station.intermediate[currentIndex - 1].time;
  //           if (!compareTime(value, previousTime)) {
  //             form.setFieldError(
  //               `station.intermediate.${currentIndex}.time.subTime`,
  //               '时间应晚于前一站点'
  //             );
  //             return '时间应晚于前一站点';
  //           }
  //         }
  //         return undefined;
  //       },
  //       type: (value) => {
  //         if (value.length === 0) {
  //           return '请输入类型';
  //         }
  //         return undefined;
  //       },
  //     },
  //   },
  //   company: {
  //     id: (value) => {
  //       if (value.length === 0) {
  //         return '请选择运营公司';
  //       }
  //       return undefined;
  //     },
  //   },
  //   schedule: {
  //     departTime: (value) => {
  //       if (value.length === 0) {
  //         return '请选择发车时间';
  //       }
  //       return undefined;
  //     },
  //     frequency: (value) => {
  //       if (value.length === 0) {
  //         return '请选择发车频次';
  //       }
  //       return undefined;
  //     },
  //   },
  //   shuttle: {
  //     startTime: (value, values) => {
  //       if (values.shuttle.enabled && value.length === 0) {
  //         return '请选择开始时间';
  //       }
  //       return undefined;
  //     },
  //     endTime: (value, values) => {
  //       if (values.shuttle.enabled && value.length === 0) {
  //         return '请选择结束时间';
  //       }
  //       return undefined;
  //     },
  //   },
  // },
  // onValuesChange: (values, changedValues) => {
  //   console.log({ values, changedValues });
  //
  //   values.station.intermediate.forEach((item, index) => {
  //     handleStationChange(
  //       `intermediate.${index}`,
  //       changedValues.station.intermediate[index]?.id,
  //       item.id,
  //       item.type !== 'station'
  //     );
  //   });
  // },

  const data = useWatch({
    control: form.control,
  });

  const addStationListRef = useRef(addStationList);

  useEffect(() => {
    addStationListRef.current = addStationList;
  }, [addStationList]);

  // const handleStationChange = (
  //   key: string,
  //   previousValue: string,
  //   value: string,
  //   flag: boolean
  // ) => {
  //   if (previousValue === 'ADD' || flag) {
  //     const newList = addStationListRef.current.filter((v) => v !== key);
  //     newList.sort();
  //     setAddStationList(newList);
  //     onAddStation(newList);
  //   }
  //
  //   if (value === 'ADD' && !flag) {
  //     const newList = [...addStationListRef.current, key];
  //     newList.sort();
  //     setAddStationList(newList);
  //     onAddStation(newList);
  //   }
  // };

  // form.watch('plate.type', () => {
  //   form.validateField('plate.number.province');
  //   form.validateField('plate.number.detail');
  // });
  //
  // form.watch('plate.number.province', () => {
  //   form.validateField('plate.number.province');
  //   form.validateField('plate.number.detail');
  // });
  //
  // form.watch('plate.number.detail', () => {
  //   form.validateField('plate.number.detail');
  // });
  //
  // form.watch('station.from.id', ({ previousValue, value, touched, dirty }) => {
  //   console.log({ previousValue, value, touched, dirty });
  //   handleStationChange('from', previousValue, value, form.getValues().station.from.outside);
  // });
  //
  // form.watch('station.to.id', ({ previousValue, value, touched, dirty }) => {
  //   console.log({ previousValue, value, touched, dirty });
  //   handleStationChange('to', previousValue, value, form.getValues().station.to.outside);
  // });

  const onSub: SubmitHandler<NewRunType> = (_data) => console.log(_data);

  const { control } = form;

  return (
    <>
      <FormProvider {...form}>
        <CustomCard title="填写班线信息" collapsible>
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
                      name="station.from.id"
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
                      name="station.to.id"
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
                      address: {
                        name: '',
                        mapid: '',
                        lon: 116.397428,
                        lat: 39.90923,
                        administrative: '',
                      },
                      time: {
                        day: 0,
                        subTime: '',
                      },
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
                  // verify all fields
                  form.getValues().station.intermediate.forEach(() => {
                    form.trigger('station.intermediate');
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
          <Text display="none">{JSON.stringify(data)}</Text>
          <Text display="none">{JSON.stringify(form.formState.errors)}</Text>
        </CustomCard>
      </FormProvider>
    </>
  );
});
