"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Gauge,
  Route,
  Play,
  Download,
  Share2,
  Map,
  Bookmark,
  Star,
  ChevronRight,
  Navigation,
  Mountain,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/translations";

interface RoutePreferences {
  description: string;
  difficulty: number;
  duration: number;
  distance: number;
}

interface GeneratedRoute {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  duration: number;
  distance: number;
  coordinates: [number, number][];
  created: string;
  type: string;
}

export function RouteFormsContent() {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(3);
  const [duration, setDuration] = useState(2);
  const [distance, setDistance] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState<GeneratedRoute | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<GeneratedRoute[]>([
    {
      id: "1",
      name: "Morning City Loop",
      description: "Perfect morning run through downtown",
      difficulty: 2,
      duration: 1.5,
      distance: 8,
      coordinates: [],
      created: "2 days ago",
      type: "Running",
    },
    {
      id: "2", 
      name: "Mountain Trail Challenge",
      description: "Challenging hike with scenic views",
      difficulty: 4,
      duration: 4,
      distance: 12,
      coordinates: [],
      created: "1 week ago",
      type: "Hiking",
    },
    {
      id: "3",
      name: "Coastal Cycling Route",
      description: "Relaxing coastal bike ride",
      difficulty: 3,
      duration: 3,
      distance: 25,
      coordinates: [],
      created: "2 weeks ago",
      type: "Cycling",
    },
  ]);

  const generateRoute = async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate API call to route generation
      const response = await fetch("/api/route/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startLocation: [8.5417, 47.3769], // Zurich coordinates as default
          preferences: {
            description,
            difficulty,
            duration,
            distance,
          },
        }),
      });

      if (response.ok) {
        const routeData = await response.json();
        const newRoute: GeneratedRoute = {
          id: Date.now().toString(),
          name: description || `Generated Route ${savedRoutes.length + 1}`,
          description,
          difficulty,
          duration,
          distance,
          coordinates: routeData.geometry.coordinates,
          created: "Just now",
          type: getRouteType(difficulty),
        };
        setGeneratedRoute(newRoute);
      }
    } catch (error) {
      console.error("Failed to generate route:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRoute = () => {
    if (generatedRoute) {
      setSavedRoutes([generatedRoute, ...savedRoutes]);
      setGeneratedRoute(null);
      // Reset form
      setDescription("");
      setDifficulty(3);
      setDuration(2);
      setDistance(5);
    }
  };

  const getRouteType = (difficulty: number) => {
    if (difficulty <= 2) return t('routeGenerator.routeTypes.walking' as const);
    if (difficulty <= 3) return t('routeGenerator.routeTypes.running' as const);
    if (difficulty <= 4) return t('routeGenerator.routeTypes.cycling' as const);
    return t('routeGenerator.routeTypes.hiking' as const);
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    if (level <= 3) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    if (level <= 4) return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return t('routeGenerator.difficulty.easy' as const);
    if (level <= 3) return t('routeGenerator.difficulty.moderate' as const);
    if (level <= 4) return t('routeGenerator.difficulty.hard' as const);
    return t('routeGenerator.difficulty.expert' as const);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Route className="w-8 h-8 text-primary" />
            {t('routeGenerator.title' as const)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('routeGenerator.subtitle' as const)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Map className="w-3 h-3 mr-1" />
            {t('routeGenerator.aiPowered' as const)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Navigation className="w-3 h-3 mr-1" />
            {t('routeGenerator.gpsReady' as const)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Route Generator Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {t('routeGenerator.generateNewRoute' as const)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('routeGenerator.routeDescription' as const)}
              </label>
              <Input
                placeholder={t('routeGenerator.routeDescriptionPlaceholder' as const)}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  Difficulty ({difficulty}/5)
                </label>
                <Slider
                  value={[difficulty]}
                  onValueChange={([value]) => setDifficulty(value)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="mt-2">
                  <Badge className={getDifficultyColor(difficulty)}>
                    {getDifficultyLabel(difficulty)}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration ({duration}h)
                </label>
                <Slider
                  value={[duration]}
                  onValueChange={([value]) => setDuration(value)}
                  min={0.5}
                  max={8}
                  step={0.5}
                  className="w-full"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {duration} hour{duration !== 1 ? "s" : ""}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Distance ({distance}km)
                </label>
                <Slider
                  value={[distance]}
                  onValueChange={([value]) => setDistance(value)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {distance} kilometer{distance !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <Button
              onClick={generateRoute}
              disabled={!description.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
                              {isGenerating ? (
                  <>
                    <Timer className="w-4 h-4 mr-2 animate-spin" />
                    {t('routeGenerator.generatingRoute' as const)}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {t('routeGenerator.generateRoute' as const)}
                  </>
                )}
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('routeGenerator.yourStats' as const)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('routeGenerator.routesGenerated' as const)}</span>
                <Badge variant="secondary">23</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('routeGenerator.totalDistance' as const)}</span>
                <Badge variant="secondary">184 km</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('routeGenerator.avgDuration' as const)}</span>
                <Badge variant="secondary">2.5 hrs</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t('routeGenerator.favoriteType' as const)}</span>
                <Badge variant="secondary">{t('routeGenerator.routeTypes.running' as const)}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('routeGenerator.quickActions' as const)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Mountain className="w-4 h-4 mr-2" />
                {t('routeGenerator.mountainTrail' as const)}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Route className="w-4 h-4 mr-2" />
                {t('routeGenerator.cityLoop' as const)}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                {t('routeGenerator.coastalPath' as const)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Generated Route Preview */}
      <AnimatePresence>
        {generatedRoute && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold">{t('routeGenerator.generatedRoute' as const)}</h3>
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <h4 className="text-lg font-semibold">{generatedRoute.name}</h4>
                    <p className="text-muted-foreground">{generatedRoute.description}</p>
                    
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge className={getDifficultyColor(generatedRoute.difficulty)}>
                        <Gauge className="w-3 h-3 mr-1" />
                        {getDifficultyLabel(generatedRoute.difficulty)}
                      </Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {generatedRoute.duration}h
                      </Badge>
                      <Badge variant="outline">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {generatedRoute.distance}km
                      </Badge>
                      <Badge variant="outline">
                        {generatedRoute.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button onClick={saveRoute} size="sm">
                      <Bookmark className="w-4 h-4 mr-1" />
                      {t('routeGenerator.saveRoute' as const)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Routes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{t('routeGenerator.savedRoutes' as const)}</h3>
          <Badge variant="outline">{savedRoutes.length} {t('routeGenerator.routes' as const)}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-all group cursor-pointer">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">
                        {route.name}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {route.description}
                    </p>
                    
                                         <div className="flex items-center gap-2 flex-wrap">
                       <Badge className={getDifficultyColor(route.difficulty)}>
                         {getDifficultyLabel(route.difficulty)}
                       </Badge>
                       <Badge variant="outline">
                         {route.duration}h
                       </Badge>
                       <Badge variant="outline">
                         {route.distance}km
                       </Badge>
                     </div>
                     
                     <div className="flex items-center justify-between">
                       <span className="text-xs text-muted-foreground">{route.created}</span>
                       <Badge variant="secondary">{route.type}</Badge>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 