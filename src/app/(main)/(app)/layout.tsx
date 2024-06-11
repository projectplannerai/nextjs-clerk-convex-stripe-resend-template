import React from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto pt-10">{children}</div>;
}
