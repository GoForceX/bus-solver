import '@mantine/core/styles.css';
import React from 'react';
import {
  MantineProvider,
  ColorSchemeScript,
  MantineColorsTuple,
  createTheme,
  Container,
} from '@mantine/core';

import { AppHeader } from '@/components/AppHeader/AppHeader';

export const metadata = {
  title: '望青客运信息站',
  description: '',
};

const myColor: MantineColorsTuple = [
  '#effee7',
  '#e0f8d4',
  '#c2efab',
  '#a2e67e',
  '#87de57',
  '#75d940',
  '#6bd731',
  '#59be23',
  '#4da91b',
  '#3d920c',
];

const theme = createTheme({
  primaryColor: 'main',
  colors: {
    main: myColor,
  },
});

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <AppHeader />
          <Container>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
