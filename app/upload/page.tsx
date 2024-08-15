'use client';

import { Button, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';

import { CustomCard } from '@/components/CustomCard/CustomCard';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <CustomCard title="选择提交内容">
        <Stack>
          <Button color="green" onClick={() => router.push('/upload/run')}>
            提交新班线
          </Button>
          <Button color="yellow">提交新车站</Button>
          <Button color="red">提交新营运公司</Button>
        </Stack>
      </CustomCard>
    </>
  );
}
