// Demo configuration for portfolio showcase
export const DEMO_CONFIG = {
  // Enable demo mode - simplified configuration
  enabled: (
    (typeof window === 'undefined' 
      ? process.env.DEMO_MODE === 'true'
      : process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    ) || process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  ),
  
  // Demo user credentials
  demoUsers: [
    {
      email: 'demo@dknex.com',
      password: 'Demo123!@#',
      name: 'Demo User',
      role: 'user'
    },
    {
      email: 'admin@dknex.com', 
      password: 'Admin123!@#',
      name: 'Admin Demo',
      role: 'admin'
    }
  ],

  // Features to disable in demo mode
  disabledFeatures: {
    registration: true,        // Disable new user registration
    googleAuth: true,         // Disable Google OAuth
    emailVerification: true,  // Skip email verification
    twoFactorAuth: false,     // Keep 2FA for demo
    profileEditing: true,     // Disable profile changes
    accountDeletion: true,    // Disable account deletion
  },

  // Demo data limits
  limits: {
    maxForms: 10,
    maxSubmissions: 100,
    maxNotifications: 50,
  },

  // Demo reset interval (in hours)
  resetInterval: 24,
  
  // Warning messages
  messages: {
    demoWarning: "This is a demo environment. Data may be reset periodically.",
    loginPrompt: "Use demo@dknex.com / Demo123!@# to explore the platform",
    featureDisabled: "This feature is disabled in demo mode"
  }
};

export const isDemoMode = () => DEMO_CONFIG.enabled;

export const getDemoCredentials = () => DEMO_CONFIG.demoUsers;

export const isFeatureDisabled = (feature: keyof typeof DEMO_CONFIG.disabledFeatures) => {
  return isDemoMode() && DEMO_CONFIG.disabledFeatures[feature];
};

export const getDemoMessage = (key: keyof typeof DEMO_CONFIG.messages) => {
  return DEMO_CONFIG.messages[key];
}; 