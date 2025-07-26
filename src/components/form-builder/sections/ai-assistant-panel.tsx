'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  Sparkles, 
  Wand2, 
  Target, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Lightbulb,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { FormField, AISuggestion, AIFormAnalysis, AIFieldRecommendation } from '../types';

interface AIAssistantPanelProps {
  fields: FormField[];
  showAIAssistant: boolean;
  onSelectField: (field: FormField) => void;
  onAddField: (type: FormField['type'], template?: any) => void;
  onUpdateField: (fieldId: string, updates: Partial<FormField>) => void;
}

export function AIAssistantPanel({
  fields,
  showAIAssistant,
  onSelectField,
  onAddField,
  onUpdateField
}: AIAssistantPanelProps) {
  const [analysis, setAnalysis] = useState<AIFormAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');

  // Simulate AI analysis when fields change
  useEffect(() => {
    if (fields.length > 0) {
      simulateAIAnalysis();
    }
  }, [fields]);

  const simulateAIAnalysis = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAnalysis: AIFormAnalysis = {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      suggestions: generateSuggestions(),
      insights: {
        conversionOptimization: [
          'Consider reducing form length by 20% to improve completion rates',
          'Add progress indicators for multi-step forms',
          'Place most important fields at the beginning'
        ],
        userExperience: [
          'Group related fields together for better flow',
          'Use conditional logic to show relevant fields only',
          'Add helpful placeholder text for complex fields'
        ],
        accessibility: [
          'Ensure all fields have proper labels',
          'Add ARIA descriptions for complex interactions',
          'Test with screen readers'
        ],
        performance: [
          'Optimize field validation for better responsiveness',
          'Consider lazy loading for large forms',
          'Minimize required fields to reduce friction'
        ]
      },
      predictedMetrics: {
        completionRate: Math.random() * 20 + 75, // 75-95%
        abandonmentRate: Math.random() * 15 + 5, // 5-20%
        timeToComplete: Math.random() * 180 + 120 // 2-5 minutes
      }
    };

    setAnalysis(mockAnalysis);
    setSuggestions(mockAnalysis.suggestions);
    setIsLoading(false);
  };

  const generateSuggestions = (): AISuggestion[] => {
    const possibleSuggestions = [
      {
        id: '1',
        type: 'field' as const,
        title: 'Add Email Validation',
        description: 'Improve data quality by adding email format validation',
        confidence: 0.9,
        action: () => {
          const emailField = fields.find(f => f.type === 'email');
          if (emailField) {
            onUpdateField(emailField.id, {
              validation: {
                ...emailField.validation,
                pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
                customMessage: 'Please enter a valid email address'
              }
            });
          }
        },
        preview: 'Adds regex validation for email format'
      },
      {
        id: '2',
        type: 'optimization' as const,
        title: 'Reorder Fields for Better Flow',
        description: 'Move contact information to the top for improved user experience',
        confidence: 0.8,
        action: () => {
          // Logic to reorder fields
          console.log('Reordering fields...');
        },
        preview: 'Moves name and email fields to the beginning'
      },
      {
        id: '3',
        type: 'styling' as const,
        title: 'Improve Visual Hierarchy',
        description: 'Add better spacing and grouping to reduce cognitive load',
        confidence: 0.75,
        action: () => {
          // Logic to improve styling
          console.log('Improving styling...');
        },
        preview: 'Groups related fields with section dividers'
      },
      {
        id: '4',
        type: 'validation' as const,
        title: 'Add Smart Phone Validation',
        description: 'AI-powered phone number validation with international support',
        confidence: 0.95,
        action: () => {
          const phoneField = fields.find(f => f.type === 'phone');
          if (phoneField) {
            onUpdateField(phoneField.id, {
              validation: {
                ...phoneField.validation,
                aiValidation: {
                  enabled: true,
                  rules: ['international_format', 'valid_country_code'],
                  severity: 'error'
                }
              }
            });
          }
        },
        preview: 'Validates phone numbers across 200+ countries'
      }
    ];

    return possibleSuggestions.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = [
      "I'd recommend adding a progress indicator to improve user experience. Studies show it can increase completion rates by up to 15%.",
      "For better accessibility, consider adding aria-labels to your form fields. This helps screen readers understand the content better.",
      "You might want to group related fields together. For example, put all contact information in one section.",
      "Consider using conditional logic to show/hide fields based on user responses. This keeps the form clean and focused.",
    ];

    const aiResponse = responses[Math.floor(Math.random() * responses.length)];
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'field': return <Sparkles className="w-4 h-4" />;
      case 'validation': return <CheckCircle className="w-4 h-4" />;
      case 'styling': return <Wand2 className="w-4 h-4" />;
      case 'logic': return <Zap className="w-4 h-4" />;
      case 'optimization': return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (!showAIAssistant) return null;

  return (
    <Card className="w-80 h-full border-l bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-purple-500" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
            <TabsTrigger value="suggestions" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs">
              <Target className="w-3 h-3 mr-1" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="px-4 pb-4">
              <TabsContent value="suggestions" className="mt-0">
                <div className="space-y-3">
                  {isLoading && suggestions.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                      <span className="ml-2 text-sm text-muted-foreground">Analyzing form...</span>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="border border-purple-200/50 bg-white/60 dark:bg-slate-800/60">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getSuggestionIcon(suggestion.type)}
                              <h4 className="font-semibold text-sm">{suggestion.title}</h4>
                            </div>
                            <Badge className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}>
                              {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">{suggestion.description}</p>
                          {suggestion.preview && (
                            <p className="text-xs italic text-purple-600 dark:text-purple-400 mb-3">
                              {suggestion.preview}
                            </p>
                          )}
                          <Button 
                            size="sm" 
                            onClick={suggestion.action}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          >
                            Apply Suggestion
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0">
                {analysis ? (
                  <div className="space-y-4">
                    <Card className="border border-purple-200/50 bg-white/60 dark:bg-slate-800/60">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Form Quality Score</h3>
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {analysis.score}/100
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Completion Rate</span>
                              <span>{analysis.predictedMetrics.completionRate.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                                style={{ width: `${analysis.predictedMetrics.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-3">
                      {Object.entries(analysis.insights).map(([category, items]) => (
                        <Card key={category} className="border border-purple-200/50 bg-white/60 dark:bg-slate-800/60">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm capitalize flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="space-y-1">
                              {items.map((item, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <span className="text-purple-500 mt-1">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <Brain className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Add some fields to see AI analysis</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chat" className="mt-0">
                <div className="space-y-3">
                  <ScrollArea className="h-64 border border-purple-200/50 rounded-lg p-3 bg-white/60 dark:bg-slate-800/60">
                    {chatHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Ask me anything about form building!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {chatHistory.map((message, index) => (
                          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                              message.role === 'user' 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              {message.content}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                              <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask AI for help with your form..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="min-h-[80px] resize-none border-purple-200/50 bg-white/60 dark:bg-slate-800/60"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleChatSubmit();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleChatSubmit}
                      disabled={!chatInput.trim() || isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
} 