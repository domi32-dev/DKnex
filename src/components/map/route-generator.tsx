'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/i18n/translations';

interface RouteGeneratorProps {
  onGenerateRoute: (preferences: RoutePreferences) => void;
}

export interface RoutePreferences {
  description: string;
  difficulty: number;
  duration: number;
  distance: number;
}

export function RouteGenerator({ onGenerateRoute }: RouteGeneratorProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [duration, setDuration] = useState(2);
  const [distance, setDistance] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateRoute({
      description,
      difficulty,
      duration,
      distance,
    });
  };

  return (
    <div className="absolute top-4 right-4 bg-background/95 p-4 rounded-lg shadow-lg border border-border w-80 z-[1000]">
      <h3 className="text-lg font-semibold mb-4">{t('map.generateRoute' as const)}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t('map.routeDescription' as const)}
          </label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('map.routeDescriptionPlaceholder' as const)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('map.difficulty' as const)} ({difficulty}/5)
          </label>
          <Slider
            value={[difficulty]}
            onValueChange={([value]) => setDifficulty(value)}
            min={1}
            max={5}
            step={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('map.duration' as const)} ({duration}h)
          </label>
          <Slider
            value={[duration]}
            onValueChange={([value]) => setDuration(value)}
            min={1}
            max={8}
            step={0.5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('map.distance' as const)} ({distance}km)
          </label>
          <Slider
            value={[distance]}
            onValueChange={([value]) => setDistance(value)}
            min={1}
            max={20}
            step={1}
          />
        </div>

        <Button type="submit" className="w-full">
          {t('map.generateRoute' as const)}
        </Button>
      </form>
    </div>
  );
} 