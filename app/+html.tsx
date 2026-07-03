import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: #05070D;
}
body {
  display: flex;
  justify-content: center;
}
#root {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background: linear-gradient(180deg, #05070D 0%, #080B14 50%, #101426 100%);
}
`;
