import type { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren) => {
  return <div style={{ padding: 20 }}>{children}</div>;
};
