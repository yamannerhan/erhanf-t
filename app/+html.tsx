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
  height: 100dvh;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  overflow-x: hidden;
  background: #05070D;
}
body {
  display: flex;
  justify-content: center;
}
#root {
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  height: 100dvh;
  overflow-x: hidden;
  background: linear-gradient(180deg, #05070D 0%, #080B14 50%, #101426 100%);
}
img, [data-expo-image] {
  object-fit: cover;
  object-position: center;
}
`;
