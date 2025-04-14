import { registerPlugin, initializePlugins, builtInPlugins } from './plugin-api';

// Register built-in plugins
export function registerBuiltInPlugins() {
  builtInPlugins.forEach(plugin => {
    try {
      registerPlugin(plugin, plugin.setup);
    } catch (error) {
      console.error(`Failed to register built-in plugin ${plugin.name}:`, error);
    }
  });
  
  // Initialize all plugins
  initializePlugins();
}

// Example Plugin: Stripe Payment Gateway
export const stripePaymentPlugin = {
  id: 'stripe-gateway',
  name: 'Stripe Payment Gateway',
  version: '1.0.0',
  author: 'Amal Pharmacy',
  description: 'Integrate Stripe payment processing',
  setup: (api) => {
    // Register hooks
    api.registerHook('activate', () => {
      console.log('Stripe Payment Gateway activated');
    });
    
    api.registerHook('deactivate', () => {
      console.log('Stripe Payment Gateway deactivated');
    });
    
    // Add filters
    api.addFilter('checkout.paymentMethods', (methods) => {
      return [
        ...methods, 
        { 
          id: 'stripe', 
          name: 'Credit/Debit Card',
          icon: 'CreditCardIcon'
        }
      ];
    });
    
    // Add actions
    api.addAction('order.completed', (order) => {
      console.log('Processing Stripe payment for order:', order.id);
    });
  }
};

// Example Plugin: SEO Toolkit
export const seoToolkitPlugin = {
  id: 'seo-toolkit',
  name: 'SEO Toolkit',
  version: '1.0.0',
  author: 'Amal Pharmacy',
  description: 'Enhance SEO with metadata and sitemaps',
  setup: (api) => {
    // Add metadata filter
    api.addFilter('page.metadata', (metadata, page) => {
      // Enhance metadata with SEO tags
      return {
        ...metadata,
        title: `${page.title} | Amal Pharmacy - Best Medications`,
        description: page.description || 'Find quality medications and healthcare products at Amal Pharmacy',
        keywords: `${page.keywords || ''}, pharmacy, medications, healthcare, medical supplies`
      };
    });
    
    // Add sitemap generation action
    api.addAction('site.updated', () => {
      console.log('Regenerating sitemap after site update');
    });
  }
};

// Example Plugin: Analytics
export const analyticsPlugin = {
  id: 'advanced-analytics',
  name: 'Advanced Analytics',
  version: '1.0.0',
  author: 'Amal Pharmacy',
  description: 'Track detailed user behavior and sales analytics',
  setup: (api) => {
    // Track page views
    api.addAction('page.view', (page) => {
      console.log(`Page viewed: ${page.title}`);
    });
    
    // Track add to cart events
    api.addAction('cart.addItem', (item) => {
      console.log(`Item added to cart: ${item.name}`);
    });
    
    // Track checkout events
    api.addAction('order.created', (order) => {
      console.log(`Order created: ${order.id} with total ${order.total}`);
    });
  }
};

// Register example plugins
export function registerExamplePlugins() {
  registerPlugin(stripePaymentPlugin, stripePaymentPlugin.setup);
  registerPlugin(seoToolkitPlugin, seoToolkitPlugin.setup);
  registerPlugin(analyticsPlugin, analyticsPlugin.setup);
}