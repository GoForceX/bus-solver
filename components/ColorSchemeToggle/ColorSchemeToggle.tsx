'use client';

import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useState } from 'react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const [colorSchemeVar, setColorSchemeVar] = useState(useColorScheme());

  function onThemeChange() {
    setColorSchemeVar(colorSchemeVar === 'dark' ? 'light' : 'dark');
    setColorScheme(colorSchemeVar);
  }

  return (
    <ActionIcon onClick={onThemeChange} variant="default" size="md" style={{ paddingTop: '2px' }}>
      <>
        <IconSun
          style={{ width: '70%', height: '70%' }}
          stroke={1.5}
          display={(() => {
            if (colorSchemeVar === 'light') {
              return 'none';
            }
            return '';
          })()}
        />
        <IconMoon
          style={{ width: '70%', height: '70%' }}
          stroke={1.5}
          display={(() => {
            if (colorSchemeVar === 'dark') {
              return 'none';
            }
            return '';
          })()}
        />
      </>
    </ActionIcon>
  );
}
