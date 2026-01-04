'use client';

import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { ClientForm } from '@/components/clients/ClientForm';

function NewClientPage() {
  return (
    <AppLayout>
      <div className="w-full h-full flex flex-col">
        <ClientForm />
      </div>
    </AppLayout>
  );
}

export default NewClientPage;
