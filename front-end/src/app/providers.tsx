"use client";

import {
  FluentProvider,
  webDarkTheme,
} from "@fluentui/react-components";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FluentProvider theme={webDarkTheme} style={{ background: "transparent" }}>
      {children}
    </FluentProvider>
  );
}
