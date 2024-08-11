'use client';

import { useState } from 'react';
import { Container, Group, Burger, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import classes from './AppHeader.module.css';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

const links = [
  { link: '/upload', label: '上传' },
  { link: '/query', label: '检索' },
  { link: '/user', label: '用户中心' },
];

export function AppHeader() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);

  const router = useRouter();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        router.push(link.link);
        setActive(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <UnstyledButton
          className={classes.logo}
          onClick={(event) => {
            event.preventDefault();
            router.push('/');
            setActive('/');
          }}
        >
          望青客运信息站
        </UnstyledButton>
        <Group gap={5} visibleFrom="xs">
          {items}
          <ColorSchemeToggle />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
