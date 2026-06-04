import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Applications — Power Zone',
  description:
    'Discover how Power Zone systems meet key operational goals across industries — from power quality to emissions reduction.',
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
