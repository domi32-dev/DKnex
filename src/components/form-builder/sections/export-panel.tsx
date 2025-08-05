'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  X, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Search,
  FileText,
  Code,
  Globe,
  Building
} from 'lucide-react';
import { PLATFORM_EXPORTS } from '../constants';
import { FormExportData, ExportResult, ExportFile } from '../types';
import { generateSharePointSPFx, generateSharePointDirect, generateReactComponent } from '@/lib/export-generators';
import JSZip from 'jszip';

interface ExportPanelProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormExportData;
}

export function ExportPanel({ isOpen, onClose, formData }: ExportPanelProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Platforms', icon: Globe },
    { id: 'enterprise', label: 'Enterprise', icon: Building },
    { id: 'framework', label: 'Frameworks', icon: Code },
    { id: 'cms', label: 'CMS', icon: FileText },
  ];

  const filteredPlatforms = PLATFORM_EXPORTS.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = async (platformId: string) => {
    setIsExporting(true);
    setExportResult(null);

    try {
      let result: ExportResult;

      switch (platformId) {
        case 'sharepoint-spfx':
          result = await generateSharePointSPFx(formData);
          break;
        case 'sharepoint-direct':
          result = await generateSharePointDirect(formData, {
            siteUrl: 'https://your-tenant.sharepoint.com/sites/your-site', // This should be configurable
            listName: `${formData.formName} Submissions`
          });
          break;
        case 'react':
          result = await generateReactComponent(formData);
          break;
        default:
          result = {
            success: false,
            files: [],
            instructions: [],
            errors: ['Export not yet implemented for this platform'],
            estimatedTime: '0 minutes'
          };
      }

      setExportResult(result);
    } catch (error) {
      setExportResult({
        success: false,
        files: [],
        instructions: [],
        errors: [`Export failed: ${error}`],
        estimatedTime: '0 minutes'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFiles = (result: ExportResult) => {
    if (result.files.length === 1) {
      // Single file download
      const file = result.files[0];
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Multiple files - create zip for SPFx projects
      if (result.files.some(f => f.framework === 'spfx')) {
        // For SPFx projects, create a proper project structure
        createSPFxProjectZip(result.files);
      } else {
        // For other projects, download individual files
        result.files.forEach(file => {
          const blob = new Blob([file.content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  };

  const createSPFxProjectZip = async (files: ExportFile[]) => {
    const zip = new JSZip();
    const projectName = files.find(f => f.name.includes('WebPart'))?.name.split('/')[2] || 'spfx-project';
    
    // Create all directories and files in the ZIP with proper structure
    files.forEach(file => {
      zip.file(file.name, file.content);
    });

    // Add instructions as a separate file
    const instructions = [
      '# SharePoint Framework Project Setup',
      '',
      '## Installation Steps:',
      '1. Extract all files maintaining the folder structure',
      '2. Open terminal in the project directory',
      '3. Run: npm install',
      '4. Run: gulp trust-dev-cert (for local development)',
      '5. Run: gulp serve (for testing)',
      '6. Run: gulp bundle --ship && gulp package-solution --ship (for production)',
      '7. Upload the generated .sppkg file to SharePoint App Catalog',
      '8. Add the web part to your SharePoint page',
      '',
      '## Requirements:',
      '- Node.js 16+ and npm',
      '- SharePoint Framework development tools',
      '- Access to SharePoint tenant with app catalog',
      '',
      '## Generated Files:',
      files.map(f => `- ${f.name} (${f.type})`).join('\n'),
      '',
      `Generated by DKNex Form Builder on ${new Date().toISOString()}`
    ].join('\n');

    zip.file('INSTRUCTIONS.md', instructions);

    // Generate and download the ZIP file
    try {
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}-spfx-project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      // Fallback to individual file downloads
      files.forEach(file => {
        const blob = new Blob([file.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Export Form
              </h2>
              <p className="text-muted-foreground mt-1">
                Export your form to different platforms and frameworks
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex h-[calc(95vh-120px)]">
            {/* Left Panel - Platform Selection */}
            <div className="w-1/2 border-r border-gray-200 dark:border-slate-700 p-6 overflow-y-auto">
              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  {categories.map(category => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {category.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Platform Grid */}
              <div className="grid grid-cols-1 gap-4">
                {filteredPlatforms.map(platform => (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedPlatform === platform.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {typeof platform.icon === 'string' ? (
                            platform.icon
                          ) : (
                            React.createElement(platform.icon, { className: "w-6 h-6" })
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{platform.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {platform.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {platform.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {platform.supportedFeatures.slice(0, 3).map(feature => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {platform.supportedFeatures.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{platform.supportedFeatures.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Panel - Export Details */}
            <div className="w-1/2 p-6 overflow-y-auto">
              {selectedPlatform ? (
                <div className="space-y-6">
                  {(() => {
                    const platform = PLATFORM_EXPORTS.find(p => p.id === selectedPlatform);
                    if (!platform) return null;

                    return (
                      <>
                        {/* Platform Info */}
                        <div className="flex items-center gap-3 mb-6">
                          <div className="text-3xl">
                            {typeof platform.icon === 'string' ? (
                              platform.icon
                            ) : (
                              React.createElement(platform.icon, { className: "w-8 h-8" })
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{platform.name}</h3>
                            <p className="text-muted-foreground">{platform.description}</p>
                          </div>
                        </div>

                        {/* Export Button */}
                        <Button
                          onClick={() => handleExport(platform.id)}
                          disabled={isExporting}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          {isExporting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Generating Export...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 mr-2" />
                              Export to {platform.name}
                            </>
                          )}
                        </Button>

                        {/* Export Result */}
                        {exportResult && (
                          <Card className="mt-6">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                {exportResult.success ? (
                                  <>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Export Successful
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    Export Failed
                                  </>
                                )}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {exportResult.success && (
                                <>
                                  <div>
                                    <h4 className="font-medium mb-2">Generated Files ({exportResult.files.length})</h4>
                                    <div className="space-y-2">
                                      {exportResult.files.map(file => (
                                        <div key={file.name} className="flex items-center gap-2 text-sm">
                                          <FileText className="w-4 h-4 text-blue-500" />
                                          {file.name}
                                          <Badge variant="outline" className="text-xs">
                                            {file.language || file.type}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <Button
                                    onClick={() => downloadFiles(exportResult)}
                                    className="w-full"
                                    variant="outline"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Files
                                  </Button>
                                </>
                              )}

                              {exportResult.instructions.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Installation Instructions</h4>
                                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                    {exportResult.instructions.map((instruction, index) => (
                                      <li key={index}>{instruction}</li>
                                    ))}
                                  </ol>
                                </div>
                              )}

                              {exportResult.warnings && exportResult.warnings.length > 0 && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Warnings</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                                    {exportResult.warnings.map((warning, index) => (
                                      <li key={index}>{warning}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {exportResult.errors && exportResult.errors.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Errors</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                                    {exportResult.errors.map((error, index) => (
                                      <li key={index}>{error}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {exportResult.estimatedTime && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  Estimated setup time: {exportResult.estimatedTime}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Documentation Link */}
                        {platform.documentation && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(platform.documentation, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Documentation
                          </Button>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Platform</h3>
                    <p className="text-muted-foreground">
                      Choose a platform from the left panel to export your form
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 