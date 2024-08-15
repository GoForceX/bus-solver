'use client';

import { useForm } from '@mantine/form';
import { Button, Grid, ScrollArea, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import { CustomCard } from '@/components/CustomCard/CustomCard';
import { SubmitRun } from '@/components/SubmitForm/SubmitRun';
import { SubmitStation } from '@/components/SubmitForm/SubmitStation';

export default function Page() {
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
            return undefined;
          },
        },
      },
      station: {
        from: (value) => {
          if (value.length === 0) {
            return '请选择发站';
          }
          return undefined;
        },
        to: (value) => {
          if (value.length === 0) {
            return '请选择到站';
          }
          return undefined;
        },
      },
    },

    transformValues: (values): { plateType: string; plateNumber: string } => ({
      plateType: values.plate.type,
      plateNumber: `${form.values.plate.type === 'other' ? '' : values.plate.number.province}${values.plate.number.detail.toUpperCase()}`,
    }),
  });

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 9 }}>
          <Stack gap="sm">
            <SubmitRun
              onSubmit={(value) => {
                console.log(value);
              }}
            />

            <SubmitStation
              suffix="发站"
              onSubmit={(value) => {
                console.log(value);
              }}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Stack gap="sm">
            <CustomCard title="上传须知" titleBefore={<IconInfoCircle size={16}></IconInfoCircle>} collapsible>
              <ScrollArea h={200} scrollbarSize={6} scrollHideDelay={1500}>
                <Text size="sm">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </Text>
              </ScrollArea>
            </CustomCard>
            <CustomCard title="信息确认">
              <Stack gap="sm">
                <Button type="submit" form="submitRun">
                  上传信息并送审
                </Button>
              </Stack>
            </CustomCard>
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  );
}
