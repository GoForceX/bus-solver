import { Flex, Radio, Group, TextInput, Select, rem, SimpleGrid, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';

import { plateProvince, plateValidate } from '@/app/upload/run/plateValidate';
import { CustomCard } from '../CustomCard/CustomCard';

export function SubmitRun({ onSubmit }: { onSubmit: (values: any) => void }) {
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
        from: '',
        intermediate: [] as string[],
        to: '',
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
        number: {
          detail: (value) => {
            if (!value) {
              return '车牌号不能为空';
            }
            if (form.values.plate.type === 'other') {
              return undefined;
            }
            if (!form.values.plate.number.province) {
              return '请选择车牌省份';
            }
            if (value.length !== 6 && value.length !== 7) {
              return '车牌号长度必须为 7-8 位';
            }
            if (!plateValidate(`${form.values.plate.number.province}${value.toUpperCase()}`)) {
              return '车牌号格式不正确';
            }
            return undefined;
          },
        },
      },
    },

    transformValues: (values): object => ({
      plateNumber: `${values.plate.type === 'other' ? '' : values.plate.number.province}${values.plate.number.detail.toUpperCase()}`,
      ...values,
    }),
  });

  const mockStationList = [
    { value: 'S13100001', label: '（河北省廊坊市）廊坊客运总站' },
    { value: 'S11000001', label: '（北京市）六里桥客运主枢纽' },
    { value: 'ADD', label: '+ 添加新站' },
  ];

  const mockCompanyList = [
    { value: 'C13100001', label: '廊坊通利' },
    { value: 'C13100002', label: '廊坊交运' },
    { value: 'ADD', label: '+ 添加新公司' },
  ];

  return (
    <>
      <CustomCard title="填写班线信息" collapsible>
        <form id="submitRun" onSubmit={form.onSubmit((values) => onSubmit(values))}>
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
                    form.values.plate.number.detail.toUpperCase()
                  );
                },
              }}
              key={form.key('plate.number.detail')}
              {...form.getInputProps('plate.number.detail')}
              leftSection={
                form.values.plate.type === 'other' ? undefined : (
                  <Select
                    placeholder="—"
                    data={plateProvince}
                    searchable
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
              leftSectionWidth={form.values.plate.type === 'other' ? undefined : rem(40)}
            />

            <SimpleGrid
              cols={{ base: 1, sm: 2 }}
              spacing={{ base: 10, sm: 'lg' }}
              verticalSpacing="md"
            >
              <Select
                withAsterisk
                placeholder="xxx站"
                data={mockStationList}
                label="发站"
                searchable
                key={form.key('station.from')}
                {...form.getInputProps('station.from')}
              />
              <Select
                withAsterisk
                placeholder="xxx站"
                data={mockStationList}
                label="到站"
                searchable
                key={form.key('station.to')}
                {...form.getInputProps('station.to')}
              />

              <Select
                withAsterisk
                placeholder="xxx公司"
                data={mockCompanyList}
                label="运营公司"
                searchable
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
                leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
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

            {form.values.schedule.frequency === 'other' ? (
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

            {form.values.shuttle.enabled ? (
              <SimpleGrid
                cols={{ base: 1, sm: 2 }}
                spacing={{ base: 10, sm: 'lg' }}
                verticalSpacing="md"
              >
                <TimeInput
                  label="开始时间"
                  withAsterisk
                  key={form.key('shuttle.startTime')}
                  {...form.getInputProps('shuttle.startTime')}
                />
                <TimeInput
                  label="结束时间"
                  withAsterisk
                  key={form.key('shuttle.endTime')}
                  {...form.getInputProps('shuttle.endTime')}
                />
              </SimpleGrid>
            ) : null}
          </Flex>
        </form>
      </CustomCard>
    </>
  );
}
