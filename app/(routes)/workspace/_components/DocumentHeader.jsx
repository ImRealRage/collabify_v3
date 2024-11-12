'use client';

import { Button } from '@/components/ui/button';
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import React from 'react';

function DocumentHeader() {
  return (
    <div className="flex justify-between items-center p-4 px-7 bg-white shadow-md">
      {/* OrganizationSwitcher section */}
      <div className="flex items-center">
        <OrganizationSwitcher />
      </div>
      {/* Right-side buttons */}
      <div className="flex gap-2 items-center">
        <Button>Share</Button>
        <UserButton />
      </div>
    </div>
  );
}

export default DocumentHeader;
