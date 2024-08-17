'use client';

import React from 'react';
import {
  Button,
  Grid,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import { CustomCard } from '@/components/CustomCard/CustomCard';
import { SubmitRun } from '@/components/SubmitForm/SubmitRun';
import { SubmitStation } from '@/components/SubmitForm/SubmitStation';
import { handleSubmit } from './handleSubmit';

export default function Page() {
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 12, sm: 9 }}>
          <Stack gap="sm">
            <SubmitRun
              ref={formRef}
              onSubmit={(value) => {
                console.log(value);
                handleSubmit(value);
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
            <CustomCard
              title="上传须知"
              titleBefore={<IconInfoCircle size={16}></IconInfoCircle>}
              collapsible
            >
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
                <Button
                  onClick={() => {
                    if (formRef.current) {
                      formRef.current.dispatchEvent(
                        new Event('submit', { cancelable: true, bubbles: true })
                      );
                    }
                  }}
                >
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
