"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Eye, 
  Settings, 
  Calendar, 
  Users, 
  BarChart3, 
  FileText, 
  Zap, 
  Command as CommandIcon,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: 'actions' | 'navigation' | 'forms' | 'recent';
  action: () => void;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Command registry
  const commands: CommandItem[] = [
    {
      id: 'create-form',
      label: 'Create new form',
      description: 'Start building a new form',
      icon: <Plus className="w-4 h-4" />,
      shortcut: 'Alt+N',
      category: 'actions',
      action: () => router.push('/forms'),
      keywords: ['create', 'new', 'form', 'build', 'make'],
    },
    {
      id: 'view-submissions',
      label: 'View submissions',
      description: 'See all form responses',
      icon: <Eye className="w-4 h-4" />,
      shortcut: 'Alt+V',
      category: 'navigation',
      action: () => router.push('/submissions'),
      keywords: ['submissions', 'responses', 'data', 'view', 'results'],
    },
    {
      id: 'analytics',
      label: 'Analytics dashboard',
      description: 'View performance metrics',
      icon: <BarChart3 className="w-4 h-4" />,
      shortcut: 'Alt+A',
      category: 'navigation',
      action: () => router.push('/analytics'),
      keywords: ['analytics', 'metrics', 'stats', 'performance', 'data'],
    },
    {
      id: 'templates',
      label: 'Browse templates',
      description: 'Explore form templates',
      icon: <FileText className="w-4 h-4" />,
      shortcut: 'Alt+T',
      category: 'navigation',
      action: () => router.push('/templates'),
      keywords: ['templates', 'examples', 'prebuilt', 'samples'],
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Configure your account',
      icon: <Settings className="w-4 h-4" />,
      shortcut: 'Alt+S',
      category: 'navigation',
      action: () => router.push('/settings'),
      keywords: ['settings', 'preferences', 'config', 'account'],
    },
    {
      id: 'calendar',
      label: 'Calendar view',
      description: 'View scheduled events',
      icon: <Calendar className="w-4 h-4" />,
      shortcut: 'Alt+C',
      category: 'navigation',
      action: () => router.push('/calendar'),
      keywords: ['calendar', 'events', 'schedule', 'dates'],
    },
    {
      id: 'team',
      label: 'Team management',
      description: 'Manage team members',
      icon: <Users className="w-4 h-4" />,
      shortcut: 'Alt+U',
      category: 'navigation',
      action: () => router.push('/team'),
      keywords: ['team', 'members', 'users', 'collaborate'],
    },
    {
      id: 'quick-form',
      label: 'Quick contact form',
      description: 'Create a contact form instantly',
      icon: <Zap className="w-4 h-4" />,
      category: 'actions',
      action: () => router.push('/forms/quick/contact'),
      keywords: ['quick', 'contact', 'instant', 'fast'],
    },
  ];

  // Global keyboard shortcuts handler
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      
      // Find command by shortcut
      const command = commands.find(cmd => {
        if (!cmd.shortcut) return false;
        const shortcutKey = cmd.shortcut.split('+')[1]?.toLowerCase();
        return shortcutKey === e.key.toLowerCase();
      });

      if (command) {
        e.preventDefault();
        command.action();
        return;
      }
    };

    // Only add global listener when command palette is NOT open
    if (!isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [commands, router, isOpen]);

  // Filter commands based on query
  const filteredCommands = commands.filter(command => {
    if (!query) return true;
    const searchTerm = query.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchTerm) ||
      command.description?.toLowerCase().includes(searchTerm) ||
      command.keywords.some(keyword => keyword.includes(searchTerm))
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const categoryLabels = {
    actions: 'Quick Actions',
    navigation: 'Navigation',
    forms: 'Forms',
    recent: 'Recent',
  };

  // Keyboard navigation inside the command palette
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset query when opening
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const executeCommand = useCallback((command: CommandItem) => {
    command.action();
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-250/60 dark:border-slate-700/50 w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands, forms, or type to create..."
                  className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                  autoFocus
                />
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">↑↓</Badge>
                  <Badge variant="outline" className="text-xs">↵</Badge>
                  <Badge variant="outline" className="text-xs">ESC</Badge>
                </div>
              </div>
            </div>
            
            {/* Command Results */}
            <div className="p-2 max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-2">No commands found</p>
                  <p className="text-sm text-muted-foreground">
                    Try searching for "create", "view", or "settings"
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(groupedCommands).map(([category, commands]) => (
                    <div key={category}>
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </div>
                      {commands.map((command, index) => {
                        const globalIndex = filteredCommands.indexOf(command);
                        return (
                          <motion.div
                            key={command.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              selectedIndex === globalIndex
                                ? 'bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => executeCommand(command)}
                            whileHover={{ x: selectedIndex === globalIndex ? 0 : 2 }}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="flex-shrink-0">
                                {command.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {command.label}
                                </div>
                                {command.description && (
                                  <div className="text-xs text-muted-foreground truncate">
                                    {command.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {command.shortcut && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    selectedIndex === globalIndex 
                                      ? 'border-blue-300 dark:border-blue-700' 
                                      : 'opacity-50'
                                  }`}
                                >
                                  {command.shortcut}
                                </Badge>
                              )}
                              {selectedIndex === globalIndex && (
                                <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <CommandIcon className="w-3 h-3" />
                    Command Palette
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Navigate</span>
                  <Badge variant="outline" className="text-xs">↑↓</Badge>
                  <span>Select</span>
                  <Badge variant="outline" className="text-xs">↵</Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 