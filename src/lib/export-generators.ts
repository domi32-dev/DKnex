import { FormExportData, ExportResult, ExportFile } from '@/components/form-builder/types';

// SharePoint Direct Upload Export Generator
export async function generateSharePointDirect(formData: FormExportData, sharepointConfig?: {
  siteUrl: string;
  listName?: string;
  accessToken?: string;
}): Promise<ExportResult> {
  const files: ExportFile[] = [];
  const instructions: string[] = [];
  const warnings: string[] = [];

  try {
    if (!sharepointConfig?.siteUrl) {
      return {
        success: false,
        files: [],
        instructions: [],
        errors: ['SharePoint site URL is required for direct upload'],
        estimatedTime: '0 minutes'
      };
    }

    // Generate SharePoint List schema based on form fields
    const listSchema = generateSharePointListSchema(formData);
    files.push({
      name: `${formData.formName.replace(/\s+/g, '')}-list-schema.json`,
      content: JSON.stringify(listSchema, null, 2),
      type: 'config',
      language: 'json',
      framework: 'sharepoint'
    });

    // Generate Power Automate flow for form processing
    const powerAutomateFlow = generatePowerAutomateFlow(formData);
    files.push({
      name: `${formData.formName.replace(/\s+/g, '')}-power-automate-flow.json`,
      content: JSON.stringify(powerAutomateFlow, null, 2),
      type: 'config',
      language: 'json',
      framework: 'sharepoint'
    });

    // Generate form HTML for SharePoint embedding
    const formHTML = generateSharePointFormHTML(formData);
    files.push({
      name: `${formData.formName.replace(/\s+/g, '')}-form.html`,
      content: formHTML,
      type: 'code',
      language: 'html',
      framework: 'sharepoint'
    });

    instructions.push(
      '1. Configure SharePoint authentication (see authentication guide)',
      '2. Create or select target SharePoint list',
      '3. Upload list schema to configure form fields',
      '4. Deploy Power Automate flow for form processing',
      '5. Embed form HTML in SharePoint page or web part',
      '6. Test form submission and data flow'
    );

    warnings.push(
      'Requires SharePoint administrator permissions',
      'Power Automate premium license may be required for advanced features',
      'Test in development environment before production deployment'
    );

    return {
      success: true,
      files,
      instructions,
      warnings,
      estimatedTime: '5-10 minutes'
    };

  } catch (error) {
    return {
      success: false,
      files: [],
      instructions: [],
      errors: [`Direct SharePoint export failed: ${error}`],
      estimatedTime: '0 minutes'
    };
  }
}

// SharePoint SPFx Export Generator
export async function generateSharePointSPFx(formData: FormExportData): Promise<ExportResult> {
  const files: ExportFile[] = [];
  const instructions: string[] = [];
  const warnings: string[] = [];

  try {
    // Generate the main web part component
    const webPartComponent = generateSPFxWebPart(formData);
    files.push({
      name: `src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/${formData.formName.replace(/\s+/g, '')}WebPart.tsx`,
      content: webPartComponent,
      type: 'code',
      language: 'typescript',
      framework: 'spfx'
    });

    // Generate the actual form component
    const formComponent = generateSPFxFormComponent(formData);
    files.push({
      name: `src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/components/${formData.formName.replace(/\s+/g, '')}Form.tsx`,
      content: formComponent,
      type: 'code',
      language: 'typescript',
      framework: 'spfx'
    });

    // Generate form component styles
    const formStyles = generateSPFxFormStyles(formData);
    files.push({
      name: `src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/components/${formData.formName.replace(/\s+/g, '')}Form.module.scss`,
      content: formStyles,
      type: 'code',
      language: 'scss',
      framework: 'spfx'
    });

    // Generate form component interfaces
    const formProps = generateSPFxFormProps(formData);
    files.push({
      name: `src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/components/I${formData.formName.replace(/\s+/g, '')}FormProps.ts`,
      content: formProps,
      type: 'code',
      language: 'typescript',
      framework: 'spfx'
    });

    const formState = generateSPFxFormState(formData);
    files.push({
      name: `src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/components/I${formData.formName.replace(/\s+/g, '')}FormState.ts`,
      content: formState,
      type: 'code',
      language: 'typescript',
      framework: 'spfx'
    });

    // Generate the manifest file
    const manifest = generateSPFxManifest(formData);
    files.push({
      name: `src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/${formData.formName.replace(/\s+/g, '')}WebPart.manifest.json`,
      content: manifest,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    // Generate package.json
    const packageJson = generateSPFxPackageJson(formData);
    files.push({
      name: 'package.json',
      content: packageJson,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    // Generate gulpfile.js
    const gulpfile = generateSPFxGulpfile(formData);
    files.push({
      name: 'gulpfile.js',
      content: gulpfile,
      type: 'config',
      language: 'javascript',
      framework: 'spfx'
    });

    // Generate config files
    const configJson = generateSPFxConfigJson(formData);
    files.push({
      name: 'config/config.json',
      content: configJson,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    const writeManifestsJson = generateSPFxWriteManifestsJson(formData);
    files.push({
      name: 'config/write-manifests.json',
      content: writeManifestsJson,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    const serveJson = generateSPFxServeJson(formData);
    files.push({
      name: 'config/serve.json',
      content: serveJson,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    // Generate tsconfig.json
    const tsconfig = generateSPFxTsConfig(formData);
    files.push({
      name: 'tsconfig.json',
      content: tsconfig,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    // Generate solution package configuration
    const solutionConfig = generateSPFxSolutionConfig(formData);
    files.push({
      name: 'config/package-solution.json',
      content: solutionConfig,
      type: 'config',
      language: 'json',
      framework: 'spfx'
    });

    // Generate README with instructions
    const readme = generateSPFxReadme(formData);
    files.push({
      name: 'README.md',
      content: readme,
      type: 'documentation',
      language: 'markdown',
      framework: 'spfx'
    });

    instructions.push(
      '1. Extract all files to a new directory',
      '2. Open terminal in the project directory',
      '3. Run: npm install',
      '4. Run: gulp trust-dev-cert (if developing locally)',
      '5. Run: gulp serve (for local testing)',
      '6. Run: gulp bundle --ship && gulp package-solution --ship (for production)',
      '7. Upload the generated .sppkg file to your SharePoint App Catalog',
      '8. Add the web part to your SharePoint page'
    );

    warnings.push(
      'Make sure you have SharePoint Framework development tools installed',
      'The generated solution uses SPFx version 1.17.4 - update if needed',
      'Test the web part in a development environment before deploying to production'
    );

    return {
      success: true,
      files,
      instructions,
      warnings,
      estimatedTime: '10-15 minutes'
    };

  } catch (error) {
    return {
      success: false,
      files: [],
      instructions: [],
      errors: [`Export failed: ${error}`],
      estimatedTime: '0 minutes'
    };
  }
}

// React Component Export Generator
export async function generateReactComponent(formData: FormExportData): Promise<ExportResult> {
  const files: ExportFile[] = [];
  const instructions: string[] = [];

  try {
    // Generate the main React component
    const reactComponent = generateReactFormComponent(formData);
    files.push({
      name: `${formData.formName.replace(/\s+/g, '')}Form.tsx`,
      content: reactComponent,
      type: 'code',
      language: 'typescript',
      framework: 'react'
    });

    // Generate CSS styles
    const cssStyles = generateReactStyles(formData);
    files.push({
      name: `${formData.formName.replace(/\s+/g, '')}Form.css`,
      content: cssStyles,
      type: 'code',
      language: 'css',
      framework: 'react'
    });

    // Generate TypeScript types
    const types = generateReactTypes(formData);
    files.push({
      name: `${formData.formName.replace(/\s+/g, '')}Form.types.ts`,
      content: types,
      type: 'code',
      language: 'typescript',
      framework: 'react'
    });

    // Generate usage example
    const usageExample = generateReactUsageExample(formData);
    files.push({
      name: 'UsageExample.tsx',
      content: usageExample,
      type: 'code',
      language: 'typescript',
      framework: 'react'
    });

    instructions.push(
      '1. Copy the generated files to your React project',
      '2. Install required dependencies: npm install react-hook-form @hookform/resolvers yup',
      '3. Import and use the component in your app',
      '4. Customize styles and validation as needed'
    );

    return {
      success: true,
      files,
      instructions,
      estimatedTime: '5-10 minutes'
    };

  } catch (error) {
    return {
      success: false,
      files: [],
      instructions: [],
      errors: [`Export failed: ${error}`],
      estimatedTime: '0 minutes'
    };
  }
}

// Helper functions for SharePoint SPFx generation
function generateSPFxWebPart(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `import * as React from 'react';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { ${componentName}Form } from './components/${componentName}Form';

export interface I${componentName}WebPartProps {
  description: string;
}

export default class ${componentName}WebPart extends BaseClientSideWebPart<I${componentName}WebPartProps> {
  public render(): void {
    const element: React.ReactElement = React.createElement(${componentName}Form, {
      description: this.properties.description,
      context: this.context
    });

    ReactDOM.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDOM.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Form Configuration'
          },
          groups: [
            {
              groupName: 'Form Settings',
              groupFields: [
                PropertyPaneTextField('description', {
                  label: 'Description'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}`;
}

function generateSPFxManifest(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return JSON.stringify({
    "$schema": "https://developer.microsoft.com/json-schemas/spfx/client-side-web-part-manifest.schema.json",
    "id": "12345678-1234-1234-1234-123456789012",
    "alias": `${componentName}WebPart`,
    "componentType": "WebPart",
    "version": "1.0.0",
    "manifestVersion": 2,
    "requiresCustomScript": false,
    "supportedHosts": ["SharePointWebPart"],
    "preconfiguredEntries": [{
      "groupId": "5c03119e-3074-46fd-976b-c60198311f70",
      "group": { "default": "Other" },
      "title": { "default": "${formData.formName}" },
      "description": { "default": "${formData.formName} form component" },
      "officeFabricIconFontName": "Page",
      "properties": {
        "description": "${formData.formName}"
      }
    }]
  }, null, 2);
}

function generateSPFxPackageJson(formData: FormExportData): string {
  return JSON.stringify({
    "name": `${formData.formName.toLowerCase().replace(/\s+/g, '-')}-webpart`,
    "version": "1.0.0",
    "description": "${formData.formName} SharePoint Framework Web Part",
    "main": "lib/webparts/${formData.formName.replace(/\s+/g, '')}WebPart.js",
    "scripts": {
      "build": "gulp bundle",
      "clean": "gulp clean",
      "test": "gulp test"
    },
    "dependencies": {
      "@microsoft/sp-core-library": "1.17.4",
      "@microsoft/sp-webpart-base": "1.17.4",
      "@microsoft/sp-lodash-subset": "1.17.4",
      "@microsoft/sp-office-ui-fabric-core": "1.17.4",
      "react": "17.0.1",
      "react-dom": "17.0.1"
    },
    "devDependencies": {
      "@microsoft/rush-stack-compiler-4.5": "0.1.0",
      "@microsoft/sp-build-web": "1.17.4",
      "@microsoft/sp-module-interfaces": "1.17.4",
      "@microsoft/sp-tslint-rules": "1.17.4",
      "@types/react": "17.0.45",
      "@types/react-dom": "17.0.17",
      "gulp": "4.0.2"
    }
  }, null, 2);
}

function generateSPFxReadme(formData: FormExportData): string {
  return `# ${formData.formName} SharePoint Framework Web Part

This SharePoint Framework web part was generated from DKNex form builder.

## Features
- ${formData.fields.length} form fields
- Responsive design
- SharePoint integration
- Form validation

## Installation
1. Install dependencies: \`npm install\`
2. Build the project: \`gulp bundle\`
3. Package the solution: \`gulp package-solution\`
4. Deploy to SharePoint

## Customization
Edit the form fields and validation in the component files.

## Support
For support, visit the DKNex documentation or contact support.
`;
}

function generateSPFxFormComponent(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `import * as React from 'react';
import styles from './${componentName}Form.module.scss';
import { I${componentName}FormProps } from './I${componentName}FormProps';
import { I${componentName}FormState } from './I${componentName}FormState';

export default class ${componentName}Form extends React.Component<I${componentName}FormProps, I${componentName}FormState> {
  constructor(props: I${componentName}FormProps) {
    super(props);
    this.state = {
      formData: {},
      isSubmitting: false,
      submitStatus: 'idle'
    };
  }

  private handleInputChange = (fieldName: string, value: any) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [fieldName]: value
      }
    }));
  };

  private handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    this.setState({ isSubmitting: true, submitStatus: 'idle' });

    try {
      // Here you would typically send the form data to your API
      console.log('Form data:', this.state.formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({ submitStatus: 'success' });
    } catch (error) {
      console.error('Form submission error:', error);
      this.setState({ submitStatus: 'error' });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  public render(): React.ReactElement<I${componentName}FormProps> {
    return (
      <div className={styles.${componentName.toLowerCase()}Form}>
        <div className={styles.formContainer}>
          <h2>${formData.formName}</h2>
          <form onSubmit={this.handleSubmit}>
${formData.fields.map(field => generateSPFxField(field)).join('\n')}
            <button 
              type="submit" 
              disabled={this.state.isSubmitting}
              className={styles.submitButton}
            >
              {this.state.isSubmitting ? 'Submitting...' : '${formData.settings?.submitButtonText || 'Submit'}'}
            </button>
          </form>
          
          {this.state.submitStatus === 'success' && (
            <div className={styles.successMessage}>
              ${formData.settings?.successMessage || 'Form submitted successfully!'}
            </div>
          )}
          
          {this.state.submitStatus === 'error' && (
            <div className={styles.errorMessage}>
              An error occurred. Please try again.
            </div>
          )}
        </div>
      </div>
    );
  }
}`;
}

function generateSPFxFormStyles(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `.${componentName.toLowerCase()}Form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.formContainer {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e5e9;
}

.formContainer h2 {
  margin-bottom: 24px;
  color: #323130;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.formField {
  margin-bottom: 20px;
}

.formField label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #323130;
  font-size: 14px;
}

.formField input,
.formField textarea,
.formField select {
  width: 100%;
  padding: 12px;
  border: 1px solid #d2d0ce;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.formField input:focus,
.formField textarea:focus,
.formField select:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 2px rgba(0, 120, 212, 0.25);
}

.submitButton {
  width: 100%;
  padding: 12px;
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submitButton:hover:not(:disabled) {
  background: #106ebe;
}

.submitButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.successMessage {
  margin-top: 16px;
  padding: 12px;
  background: #dff6dd;
  color: #107c10;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #107c10;
}

.errorMessage {
  margin-top: 16px;
  padding: 12px;
  background: #fde7e9;
  color: #d13438;
  border-radius: 4px;
  text-align: center;
  border: 1px solid #d13438;
}`;
}

function generateSPFxField(field: any): string {
  const fieldName = field.id;
  const fieldLabel = field.label;
  const isRequired = field.required;
  
  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'phone':
    case 'url':
      return `            <div className={styles.formField}>
              <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
              <input
                type="${field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}"
                id="${fieldName}"
                name="${fieldName}"
                placeholder="${field.placeholder || ''}"
                required={${isRequired}}
                onChange={(e) => this.handleInputChange('${fieldName}', e.target.value)}
              />
            </div>`;
    
    case 'textarea':
      return `            <div className={styles.formField}>
              <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
              <textarea
                id="${fieldName}"
                name="${fieldName}"
                placeholder="${field.placeholder || ''}"
                rows={4}
                required={${isRequired}}
                onChange={(e) => this.handleInputChange('${fieldName}', e.target.value)}
              />
            </div>`;
    
    case 'select':
      return `            <div className={styles.formField}>
              <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
              <select
                id="${fieldName}"
                name="${fieldName}"
                required={${isRequired}}
                onChange={(e) => this.handleInputChange('${fieldName}', e.target.value)}
              >
                <option value="">Select an option</option>
${field.options?.map((option: string) => `                <option value="${option}">${option}</option>`).join('\n') || ''}
              </select>
            </div>`;
    
    default:
      return `            <div className={styles.formField}>
              <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
              <input
                type="text"
                id="${fieldName}"
                name="${fieldName}"
                placeholder="${field.placeholder || ''}"
                required={${isRequired}}
                onChange={(e) => this.handleInputChange('${fieldName}', e.target.value)}
              />
            </div>`;
  }
}

function generateSPFxGulpfile(formData: FormExportData): string {
  return `'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const path = require('path');

build.addSuppression(\`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.\`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(gulp);`;
}

function generateSPFxConfigJson(formData: FormExportData): string {
  return JSON.stringify({
    "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/config.2.0.schema.json",
    "version": "2.0",
    "bundles": {
      "webpart-bundle": {
        "components": [
          {
            "entrypoint": "./lib/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/${formData.formName.replace(/\s+/g, '')}WebPart.js",
            "manifest": "./src/webparts/${formData.formName.replace(/\s+/g, '')}WebPart/${formData.formName.replace(/\s+/g, '')}WebPart.manifest.json"
          }
        ]
      }
    },
    "externals": {},
    "localizedResources": {}
  }, null, 2);
}

function generateSPFxWriteManifestsJson(formData: FormExportData): string {
  return JSON.stringify({
    "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/write-manifests.schema.json",
    "cdnBasePath": "<!-- PATH TO CDN -->"
  }, null, 2);
}

function generateSPFxServeJson(formData: FormExportData): string {
  return JSON.stringify({
    "$schema": "https://developer.microsoft.com/json-schemas/core-build/serve.schema.json",
    "port": 4321,
    "https": true,
    "serveConfigurations": {
      "default": {
        "pageUrl": "https://localhost:4321/temp/workbench.html"
      },
      "config1": {
        "pageUrl": "https://localhost:4321/temp/workbench.html",
        "customActions": {
          "TestMessage": {
            "actionId": "TestMessage",
            "actionTitle": "Test Message",
            "verb": "defaultAction"
          }
        }
      }
    }
  }, null, 2);
}

function generateSPFxTsConfig(formData: FormExportData): string {
  return JSON.stringify({
    "compilerOptions": {
      "target": "ES5",
      "forceConsistentCasingInFileNames": true,
      "module": "commonjs",
      "jsx": "react",
      "declaration": true,
      "sourceMap": true,
      "experimentalDecorators": true,
      "skipLibCheck": true,
      "outDir": "lib",
      "rootDir": "src",
      "strict": true,
      "lib": [
        "es5",
        "dom",
        "es2015.collection"
      ],
      "types": [
        "webpack-env"
      ]
    },
    "include": [
      "src/**/*"
    ],
    "exclude": [
      "node_modules",
      "lib"
    ]
  }, null, 2);
}

function generateSPFxSolutionConfig(formData: FormExportData): string {
  return JSON.stringify({
    "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
    "solution": {
      "name": "${formData.formName.replace(/\s+/g, '')}-webpart",
      "id": "12345678-1234-1234-1234-123456789012",
      "version": "1.0.0.0",
      "includeClientSideAssets": true,
      "isDomainIsolated": false,
      "developer": {
        "name": "",
        "websiteUrl": "",
        "privacyUrl": "",
        "termsOfUseUrl": ""
      }
    },
    "paths": {
      "zippedPackage": "solution/${formData.formName.toLowerCase().replace(/\s+/g, '-')}-webpart.sppkg"
    }
  }, null, 2);
}

function generateSPFxFormProps(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface I${componentName}FormProps {
  description: string;
  context: WebPartContext;
}`;
}

function generateSPFxFormState(formData: FormExportData): string {
  return `export interface I${formData.formName.replace(/\s+/g, '')}FormState {
  formData: { [key: string]: any };
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
}`;
}

// Helper functions for React generation
function generateReactFormComponent(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './${componentName}Form.css';

interface ${componentName}FormData {
${formData.fields.map(field => `  ${field.id}: ${getTypeScriptType(field.type)};`).join('\n')}
}

interface ${componentName}FormProps {
  onSubmit?: (data: ${componentName}FormData) => void;
  className?: string;
}

const ${componentName}Form: React.FC<${componentName}FormProps> = ({ onSubmit, className = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const schema = yup.object().shape({
${formData.fields.filter(field => field.required).map(field => `    ${field.id}: ${getYupValidation(field)}`).join(',\n')}
  });

  const { control, handleSubmit, formState: { errors } } = useForm<${componentName}FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
${formData.fields.map(field => `      ${field.id}: ${getDefaultValue(field)}`).join(',\n')}
    }
  });

  const onFormSubmit = async (data: ${componentName}FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      setSubmitStatus('success');
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={\`${componentName.toLowerCase()}-form \${className}\`}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="form-container">
        <h2>${formData.formName}</h2>
        
${formData.fields.map(field => generateReactField(field)).join('\n')}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : '${formData.settings.submitButtonText || 'Submit'}'}
        </button>

        {submitStatus === 'success' && (
          <div className="success-message">
            ${formData.settings.successMessage || 'Form submitted successfully!'}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="error-message">
            An error occurred. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default ${componentName}Form;`;
}

function generateReactStyles(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `.${componentName.toLowerCase()}-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  margin-bottom: 24px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.form-field {
  margin-bottom: 20px;
}

.form-field label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  outline: none;
  border-color: ${formData.settings.primaryColor || '#007bff'};
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-field .error {
  color: #dc3545;
  font-size: 14px;
  margin-top: 4px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: ${formData.settings.primaryColor || '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background: ${formData.settings.primaryColor || '#007bff'}dd;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  margin-top: 16px;
  padding: 12px;
  background: #d4edda;
  color: #155724;
  border-radius: 4px;
  text-align: center;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  text-align: center;
}`;
}

function generateReactTypes(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `export interface ${componentName}FormData {
${formData.fields.map(field => `  ${field.id}: ${getTypeScriptType(field.type)};`).join('\n')}
}

export interface ${componentName}FormProps {
  onSubmit?: (data: ${componentName}FormData) => void;
  className?: string;
}`;
}

function generateReactUsageExample(formData: FormExportData): string {
  const componentName = formData.formName.replace(/\s+/g, '');
  
  return `import React from 'react';
import ${componentName}Form from './${componentName}Form';

const App: React.FC = () => {
  const handleFormSubmit = async (data: any) => {
    console.log('Form data:', data);
    
    // Send data to your API
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        console.log('Form submitted successfully!');
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  return (
    <div className="App">
      <h1>My Application</h1>
      <${componentName}Form onSubmit={handleFormSubmit} />
    </div>
  );
};

export default App;`;
}

// Helper functions for field generation
function generateReactField(field: any): string {
  const fieldName = field.id;
  const fieldLabel = field.label;
  const isRequired = field.required;
  
  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
    case 'phone':
    case 'url':
      return `        <div className="form-field">
          <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
          <Controller
            name="${fieldName}"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="${field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : 'text'}"
                id="${fieldName}"
                placeholder="${field.placeholder || ''}"
                className={errors.${fieldName} ? 'error' : ''}
              />
            )}
          />
          {errors.${fieldName} && (
            <div className="error">{errors.${fieldName}?.message}</div>
          )}
        </div>`;
    
    case 'textarea':
      return `        <div className="form-field">
          <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
          <Controller
            name="${fieldName}"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="${fieldName}"
                placeholder="${field.placeholder || ''}"
                rows={4}
                className={errors.${fieldName} ? 'error' : ''}
              />
            )}
          />
          {errors.${fieldName} && (
            <div className="error">{errors.${fieldName}?.message}</div>
          )}
        </div>`;
    
    case 'select':
      return `        <div className="form-field">
          <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
          <Controller
            name="${fieldName}"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="${fieldName}"
                className={errors.${fieldName} ? 'error' : ''}
              >
                <option value="">Select an option</option>
${field.options?.map((option: string) => `                <option value="${option}">${option}</option>`).join('\n') || ''}
              </select>
            )}
          />
          {errors.${fieldName} && (
            <div className="error">{errors.${fieldName}?.message}</div>
          )}
        </div>`;
    
    default:
      return `        <div className="form-field">
          <label htmlFor="${fieldName}">${fieldLabel}${isRequired ? ' *' : ''}</label>
          <Controller
            name="${fieldName}"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="${fieldName}"
                placeholder="${field.placeholder || ''}"
                className={errors.${fieldName} ? 'error' : ''}
              />
            )}
          />
          {errors.${fieldName} && (
            <div className="error">{errors.${fieldName}?.message}</div>
          )}
        </div>`;
  }
}

function getTypeScriptType(fieldType: string): string {
  switch (fieldType) {
    case 'number': return 'number';
    case 'checkbox': return 'boolean';
    case 'file': return 'FileList';
    default: return 'string';
  }
}

function getYupValidation(field: any): string {
  switch (field.type) {
    case 'email':
      return 'yup.string().email("Invalid email format").required("Email is required")';
    case 'number':
      return 'yup.number().required("This field is required")';
    case 'url':
      return 'yup.string().url("Invalid URL format").required("URL is required")';
    default:
      return 'yup.string().required("This field is required")';
  }
}

function getDefaultValue(field: any): string {
  switch (field.type) {
    case 'number': return '0';
    case 'checkbox': return 'false';
    default: return "''";
  }
} 

// Helper functions for SharePoint Direct Export
function generateSharePointListSchema(formData: FormExportData): any {
  const schema = {
    title: formData.formName,
    description: `Form fields for ${formData.formName}`,
    fields: formData.fields.map(field => {
      let fieldType = 'Text';
      let additionalProps: any = {};

      switch (field.type) {
        case 'email':
        case 'url':
        case 'phone':
          fieldType = 'Text';
          additionalProps.validation = { pattern: getValidationPattern(field.type) };
          break;
        case 'number':
          fieldType = 'Number';
          if (field.validation?.min) additionalProps.min = field.validation.min;
          if (field.validation?.max) additionalProps.max = field.validation.max;
          break;
        case 'date':
          fieldType = 'DateTime';
          additionalProps.format = 'DateOnly';
          break;
        case 'datetime':
          fieldType = 'DateTime';
          break;
        case 'textarea':
          fieldType = 'Note';
          additionalProps.richText = false;
          break;
        case 'richtext':
          fieldType = 'Note';
          additionalProps.richText = true;
          break;
        case 'select':
        case 'radio':
          fieldType = 'Choice';
          additionalProps.choices = field.options || [];
          additionalProps.multiChoice = false;
          break;
        case 'checkbox':
          fieldType = 'Choice';
          additionalProps.choices = field.options || [];
          additionalProps.multiChoice = true;
          break;
        case 'file':
          fieldType = 'Attachments';
          break;
        default:
          fieldType = 'Text';
      }

      return {
        name: field.label.replace(/[^a-zA-Z0-9]/g, ''),
        displayName: field.label,
        type: fieldType,
        required: field.required,
        ...additionalProps
      };
    })
  };

  return schema;
}

function generatePowerAutomateFlow(formData: FormExportData): any {
  return {
    definition: {
      '$schema': 'https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#',
      contentVersion: '1.0.0.0',
      parameters: {},
      triggers: {
        'When_an_item_is_created': {
          type: 'ApiConnection',
          inputs: {
            host: {
              connectionName: 'shared_sharepointonline',
              operationId: 'GetOnNewItems',
              apiId: '/providers/Microsoft.PowerApps/apis/shared_sharepointonline'
            },
            parameters: {
              dataset: '{site-url}',
              table: '{list-id}'
            }
          }
        }
      },
      actions: {
        'Send_notification_email': {
          type: 'ApiConnection',
          inputs: {
            host: {
              connectionName: 'shared_outlook',
              operationId: 'SendEmailV2',
              apiId: '/providers/Microsoft.PowerApps/apis/shared_outlook'
            },
            parameters: {
              emailMessage: {
                To: 'admin@company.com',
                Subject: `New ${formData.formName} submission`,
                Body: 'A new form submission has been received.'
              }
            }
          }
        }
      }
    }
  };
}

function generateSharePointFormHTML(formData: FormExportData): string {
  const formFields = formData.fields.map(field => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
        return `
    <div class="form-field">
      <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
      <input type="${field.type === 'text' ? 'text' : field.type}" 
             id="${field.id}" 
             name="${field.id}" 
             placeholder="${field.placeholder || ''}"
             ${field.required ? 'required' : ''} />
    </div>`;
      case 'textarea':
        return `
    <div class="form-field">
      <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
      <textarea id="${field.id}" 
                name="${field.id}" 
                placeholder="${field.placeholder || ''}"
                ${field.required ? 'required' : ''}></textarea>
    </div>`;
      case 'select':
        return `
    <div class="form-field">
      <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
      <select id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>
        <option value="">Choose...</option>
        ${(field.options || []).map(option => `<option value="${option}">${option}</option>`).join('')}
      </select>
    </div>`;
      case 'checkbox':
        return `
    <div class="form-field">
      <label>${field.label}${field.required ? ' *' : ''}</label>
      ${(field.options || []).map(option => `
        <div class="checkbox-option">
          <input type="checkbox" id="${field.id}_${option}" name="${field.id}" value="${option}" />
          <label for="${field.id}_${option}">${option}</label>
        </div>
      `).join('')}
    </div>`;
      case 'radio':
        return `
    <div class="form-field">
      <label>${field.label}${field.required ? ' *' : ''}</label>
      ${(field.options || []).map(option => `
        <div class="radio-option">
          <input type="radio" id="${field.id}_${option}" name="${field.id}" value="${option}" ${field.required ? 'required' : ''} />
          <label for="${field.id}_${option}">${option}</label>
        </div>
      `).join('')}
    </div>`;
      default:
        return `
    <div class="form-field">
      <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
      <input type="text" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''} />
    </div>`;
    }
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
    <title>${formData.formName}</title>
    <style>
        .form-container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .form-field { margin-bottom: 15px; }
        .form-field label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-field input, .form-field textarea, .form-field select { 
            width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; 
        }
        .checkbox-option, .radio-option { margin: 5px 0; }
        .checkbox-option input, .radio-option input { width: auto; margin-right: 8px; }
        .submit-btn { 
            background: #0078d4; color: white; padding: 10px 20px; 
            border: none; border-radius: 4px; cursor: pointer; 
        }
        .submit-btn:hover { background: #106ebe; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>${formData.formName}</h2>
        <form id="sharepoint-form" method="post">
            ${formFields}
            <button type="submit" class="submit-btn">Submit</button>
        </form>
    </div>
    
    <script>
        document.getElementById('sharepoint-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Add SharePoint REST API submission logic here
            alert('Form submitted! (Configure SharePoint REST API integration)');
        });
    </script>
</body>
</html>`;
}

function getValidationPattern(fieldType: string): string {
  switch (fieldType) {
    case 'email':
      return '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';
    case 'phone':
      return '^[\\+]?[1-9]?[0-9]{7,15}$';
    case 'url':
      return '^https?:\\/\\/.+';
    default:
      return '';
  }
} 