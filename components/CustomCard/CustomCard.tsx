import { Card, Collapse, Group, rem, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { forwardRef } from 'react';

import classes from './CustomCard.module.css';

export const CustomCard = forwardRef<
  HTMLDivElement,
  {
    titleBefore?: React.ReactNode;
    title: string;
    titleAfter?: React.ReactNode;
    titleEnd?: React.ReactNode;
    children: React.ReactNode;
    collapsible?: boolean;
    withBorder?: boolean;
    style?: any;
  }
>(({ titleBefore, title, titleAfter, titleEnd, children, collapsible, withBorder, style }, ref) => {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <Card
      shadow="sm"
      p="md"
      radius="sm"
      withBorder={withBorder}
      style={{
        height: 'fit-content',
        ...style,
      }}
      ref={ref}
    >
      <Card.Section inheritPadding>
        <Group justify="space-between">
          <Group mt="md" mb="xs" gap={rem(4)} align="center">
            {collapsible ? (
              opened ? (
                <IconChevronDown size={16} onClick={toggle}></IconChevronDown>
              ) : (
                <IconChevronRight size={16} onClick={toggle}></IconChevronRight>
              )
            ) : null}
            {titleBefore}
            <Text className={classes.cardText}>{title}</Text>
            {titleAfter}
          </Group>
          {titleEnd}
        </Group>
      </Card.Section>
      {collapsible ? <Collapse in={opened}>{children}</Collapse> : children}
    </Card>
  );
});
