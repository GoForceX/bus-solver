import { Card, Group, Text } from '@mantine/core';
import classes from './CustomCard.module.css';

export function CustomCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Card shadow="xs" p="md" radius="sm">
      <Card.Section inheritPadding>
        <Group mt="md" mb="xs">
          <Text className={classes.cardText}>{title}</Text>
        </Group>
      </Card.Section>
      {children}
    </Card>
  );
}
