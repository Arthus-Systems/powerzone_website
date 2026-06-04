'use client';

import ApplicationsIndustries from '@/components/ApplicationsIndustries';
import ApplicationsNavbar from '@/components/ApplicationsNavbar';

export default function ApplicationsPage() {
  return (
    <div className="relative bg-[#F4EFE7]">
      <ApplicationsNavbar />
      <ApplicationsIndustries />
    </div>
  );
}
