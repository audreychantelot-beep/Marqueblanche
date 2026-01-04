'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type Client } from '@/lib/clients-data';
import { AppLayout } from '@/components/AppLayout';
import { ClientForm } from '@/components/clients/ClientForm';

type ClientWithId = Client & { id: string };

function EditClientPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const clientQuery = useMemoFirebase(() => {
    if (!user || !clientId) return null;
    return doc(firestore, 'users', user.uid, 'clients', clientId);
  }, [firestore, user, clientId]);

  const { data: clientData, isLoading } = useDoc<ClientWithId>(clientQuery);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <p>Chargement du client...</p>
        </div>
      </AppLayout>
    );
  }

  if (!clientData) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <p>Client non trouvé.</p>
        </div>
      </AppLayout>
    );
  }
  
  const clientWithId = { ...clientData, id: clientId };

  return (
    <AppLayout>
      <div className="w-full h-full flex flex-col">
        <ClientForm client={clientWithId} />
      </div>
    </AppLayout>
  );
}

export default EditClientPage;
