'use client';

import { Button, Grid, ScrollArea, Stack, Text } from '@mantine/core';
import React, { useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';

import { handleSubmit } from '@/app/upload/run/handleSubmit';
import { SubmitRun } from './SubmitRun';
import { SubmitStation } from './SubmitStation';
import { CustomCard } from '../CustomCard/CustomCard';

export function SubmitBatch({
  stationList,
  companyList,
}: {
  stationList: any[];
  companyList: any[];
}) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const [stationNodes, setStationNodes] = useState(new Map<string, React.ReactNode>());

  function parseStationKeyToTitle(key: string): string {
    if (key === 'from') {
      return '始发站';
    }
    if (key === 'to') {
      return '终点站';
    }
    if (key.startsWith('intermediate')) {
      return `中途站 - ${parseInt(key.split('.')[1], 10) + 1}`;
    }
    return '未知';
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 9 }}>
        <Stack gap="sm">
          <SubmitRun
            ref={formRef}
            stationList={stationList}
            companyList={companyList}
            onSubmit={(value) => {
              console.log(value);
              handleSubmit(value);
            }}
            onAddStation={(stationKeys) => {
              console.log(stationKeys);

              stationNodes.forEach((node, key) => {
                if (!stationKeys.includes(key)) {
                  setStationNodes((prev) => {
                    const newMap = new Map(prev);
                    newMap.delete(key);
                    return newMap;
                  });
                }
              });

              const newMap = new Map();

              stationKeys.forEach((stationKey) => {
                if (stationNodes.has(stationKey)) {
                  newMap.set(stationKey, stationNodes.get(stationKey));
                } else {
                  newMap.set(
                    stationKey,
                    <SubmitStation
                      key={`__station.${stationKey}`}
                      stationKey={stationKey}
                      suffix={parseStationKeyToTitle(stationKey)}
                      onSubmit={(values) => {
                        console.log(values);
                      }}
                    />
                  );
                }
              });

              // Update the state with the new Map
              setStationNodes(newMap);
            }}
          />

          {Array.from(stationNodes.values())}
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
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
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
  );
}
