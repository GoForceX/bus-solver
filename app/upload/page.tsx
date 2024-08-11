'use client';

import { useForm } from '@mantine/form';
import { CustomCard } from '@/components/CustomCard/CustomCard';

export default function Page() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {},

    validate: {},
  });

  return (
    <CustomCard title="提交班线信息">
      <form onSubmit={form.onSubmit((values) => console.log(values))}></form>
    </CustomCard>
  );
}
