'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from 'next-auth/react';

export const Hero = () => {
  const { data: session } = useSession();

  return (
    <Card className="w-full">
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <h1 className="text-2xl font-bold">Willkommen zurück 👋</h1>
          <p className="text-muted-foreground mt-1">
            {session?.user?.name ?? 'Gast'}
          </p>
          <Button className="mt-4">Go now</Button>
        </div>
        <Image
          src="/illustration.svg"
          alt="Dashboard Hero"
          width={100}
          height={100}
          className="hidden md:block"
        />
      </CardContent>
    </Card>
  );
};
