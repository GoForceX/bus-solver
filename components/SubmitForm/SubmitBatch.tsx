'use client';

import {
  Anchor,
  Button,
  Checkbox,
  em,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Stepper,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import React, { useState } from 'react';
import { IconArrowLeft, IconArrowRight, IconEyeCheck, IconInfoCircle } from '@tabler/icons-react';

import { handleSubmit } from '@/app/upload/run/handleSubmit';
import { SubmitRun } from './SubmitRun';
import { SubmitStation } from './SubmitStation';
import { CustomCard } from '../CustomCard/CustomCard';

import './stepper.css';

export function SubmitBatch({
  stationList,
  companyList,
}: {
  stationList: any[];
  companyList: any[];
}) {
  const [active, setActive] = useState(0);
  const [isNoticeAgreed, setNoticeAgreed] = useState(false);

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

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
    <Stack>
      <Stepper
        active={active}
        onStepClick={setActive}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="第 1 步" description="填写班线基本资料">
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
        </Stepper.Step>

        <Stepper.Step label="第 2 步" description="添加缺失站点信息">
          {stationNodes.size === 0 ? (
            <CustomCard title="无需添加信息">
              您无需添加任何站点信息。
              <br />
              请直接进入下一步。
            </CustomCard>
          ) : (
            Array.from(stationNodes.values())
          )}
        </Stepper.Step>
        <Stepper.Step label="确认并提交信息" description="阅读上传须知后才能提交！">
          <Stack gap="sm">
            <CustomCard
              title="信息确认"
              titleBefore={<IconEyeCheck size={16}></IconEyeCheck>}
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
            <CustomCard title="信息提交">
              <Stack gap="sm">
                <Checkbox
                  checked={isNoticeAgreed}
                  onChange={(event) => setNoticeAgreed(event.currentTarget.checked)}
                  label={
                    <>
                      <Text>
                        我已阅读并确认
                        <Anchor
                          component="button"
                          onClick={() => {
                            console.log('Open modal');
                            modals.openConfirmModal({
                              title: '请阅读上传须知',
                              children: (
                                <ScrollArea h={200} scrollbarSize={6} scrollHideDelay={1500}>
                                  <Text size="sm">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                                    enim ad minim veniam, quis nostrud exercitation ullamco laboris
                                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                                    in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                                    nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                                  </Text>
                                </ScrollArea>
                              ),
                              labels: { confirm: '同意', cancel: '拒绝' },
                              onCancel: () => setNoticeAgreed(false),
                              onConfirm: () => setNoticeAgreed(true),
                            });
                          }}
                        >
                          上传须知
                        </Anchor>
                      </Text>
                    </>
                  }
                />
                <Button
                  disabled={!isNoticeAgreed}
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
        </Stepper.Step>
      </Stepper>
      <Group justify="space-between">
        <Button
          leftSection={<IconArrowLeft size={14} />}
          variant="default"
          style={{
            visibility: active === 0 ? 'hidden' : 'visible',
          }}
          onClick={() => setActive(active === 0 ? 0 : active - 1)}
        >
          上一步
        </Button>
        <Button
          rightSection={<IconArrowRight size={14} />}
          variant="default"
          style={{
            visibility: active === 2 ? 'hidden' : 'visible',
          }}
          onClick={() => setActive(active === 2 ? 2 : active + 1)}
        >
          下一步
        </Button>
      </Group>
    </Stack>
  );
}

/**
 * @deprecated Use SubmitBatch instead.
 */
export function SubmitBatchOld({
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
