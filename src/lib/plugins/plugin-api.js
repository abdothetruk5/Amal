/**
 * Amal Pharmacy Plugin System API
 * 
 * This file provides the core functionality for the plugin system
 * enabling third-party developers to extend the functionality of the
 * pharmacy app in a controlled and secure way.
 */

// Store registered plugins
const registeredPlugins = new Map();
const pluginHooks = new Map();
const pluginActions = new Map();
const pluginFilters = new Map();

/**
 * Register a new plugin with the system
 * 
 * @param {Object} pluginInfo - Plugin metadata
 * @param {string} pluginInfo.id - Unique identifier for the plugin
 * @param {string} pluginInfo.name - Display name for the plugin
 * @param {string} pluginInfo.version - Plugin version
 * @param {string} pluginInfo.author - Plugin author
 * @param {string} pluginInfo.description - Plugin description
 * @param {Function} pluginSetup - Function that will be called to initialize the plugin
 */
export function registerPlugin(pluginInfo, pluginSetup) {
  if (!pluginInfo.id) {
    throw new Error('Plugin ID is required');
  }
  
  if (registeredPlugins.has(pluginInfo.id)) {
    throw new Error(`Plugin with ID ${pluginInfo.id} is already registered`);
  }
  
  try {
    registeredPlugins.set(pluginInfo.id, {
      ...pluginInfo,
      active: true,
      setup: pluginSetup
    });
    
    // Initialize the plugin if valid setup function provided
    if (typeof pluginSetup === 'function') {
      pluginSetup({
        addAction: (actionName, callback, priority = 10) => addAction(pluginInfo.id, actionName, callback, priority),
        addFilter: (filterName, callback, priority = 10) => addFilter(pluginInfo.id, filterName, callback, priority),
        registerHook: (hookName, callback) => registerHook(pluginInfo.id, hookName, callback),
      });
    }
    
    console.log(`Plugin '${pluginInfo.name}' registered successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to register plugin '${pluginInfo.name}':`, error);
    return false;
  }
}

/**
 * Deactivate a plugin
 * 
 * @param {string} pluginId - ID of the plugin to deactivate
 */
export function deactivatePlugin(pluginId) {
  const plugin = registeredPlugins.get(pluginId);
  
  if (!plugin) {
    throw new Error(`Plugin with ID ${pluginId} is not registered`);
  }
  
  try {
    // Update plugin state
    plugin.active = false;
    registeredPlugins.set(pluginId, plugin);
    
    // Run deactivation hook if registered
    if (pluginHooks.has(`${pluginId}:deactivate`)) {
      const hook = pluginHooks.get(`${pluginId}:deactivate`);
      hook();
    }
    
    console.log(`Plugin '${plugin.name}' deactivated successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to deactivate plugin '${plugin.name}':`, error);
    return false;
  }
}

/**
 * Activate a plugin
 * 
 * @param {string} pluginId - ID of the plugin to activate
 */
export function activatePlugin(pluginId) {
  const plugin = registeredPlugins.get(pluginId);
  
  if (!plugin) {
    throw new Error(`Plugin with ID ${pluginId} is not registered`);
  }
  
  try {
    // Update plugin state
    plugin.active = true;
    registeredPlugins.set(pluginId, plugin);
    
    // Run activation hook if registered
    if (pluginHooks.has(`${pluginId}:activate`)) {
      const hook = pluginHooks.get(`${pluginId}:activate`);
      hook();
    }
    
    console.log(`Plugin '${plugin.name}' activated successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to activate plugin '${plugin.name}':`, error);
    return false;
  }
}

/**
 * Get all registered plugins
 * 
 * @returns {Array} Array of plugin objects
 */
export function getPlugins() {
  return Array.from(registeredPlugins.values());
}

/**
 * Get a specific plugin by ID
 * 
 * @param {string} pluginId - ID of the plugin to get
 * @returns {Object|null} Plugin object or null if not found
 */
export function getPlugin(pluginId) {
  return registeredPlugins.get(pluginId) || null;
}

/**
 * Register a hook for a plugin
 * 
 * @param {string} pluginId - ID of the plugin registering the hook
 * @param {string} hookName - Name of the hook
 * @param {Function} callback - Function to call when the hook is triggered
 */
function registerHook(pluginId, hookName, callback) {
  if (typeof callback !== 'function') {
    throw new Error('Hook callback must be a function');
  }
  
  const hookId = `${pluginId}:${hookName}`;
  pluginHooks.set(hookId, callback);
}

/**
 * Add an action that can be triggered by the application
 * 
 * @param {string} pluginId - ID of the plugin adding the action
 * @param {string} actionName - Name of the action
 * @param {Function} callback - Function to call when the action is triggered
 * @param {number} priority - Priority of the action (lower runs first)
 */
function addAction(pluginId, actionName, callback, priority = 10) {
  if (typeof callback !== 'function') {
    throw new Error('Action callback must be a function');
  }
  
  if (!pluginActions.has(actionName)) {
    pluginActions.set(actionName, []);
  }
  
  const actions = pluginActions.get(actionName);
  actions.push({
    pluginId,
    callback,
    priority
  });
  
  // Sort by priority
  actions.sort((a, b) => a.priority - b.priority);
  
  pluginActions.set(actionName, actions);
}

/**
 * Add a filter that can modify data in the application
 * 
 * @param {string} pluginId - ID of the plugin adding the filter
 * @param {string} filterName - Name of the filter
 * @param {Function} callback - Function to call when the filter is applied
 * @param {number} priority - Priority of the filter (lower runs first)
 */
function addFilter(pluginId, filterName, callback, priority = 10) {
  if (typeof callback !== 'function') {
    throw new Error('Filter callback must be a function');
  }
  
  if (!pluginFilters.has(filterName)) {
    pluginFilters.set(filterName, []);
  }
  
  const filters = pluginFilters.get(filterName);
  filters.push({
    pluginId,
    callback,
    priority
  });
  
  // Sort by priority
  filters.sort((a, b) => a.priority - b.priority);
  
  pluginFilters.set(filterName, filters);
}

/**
 * Run all registered actions for a specific action name
 * 
 * @param {string} actionName - Name of the action to run
 * @param {...any} args - Arguments to pass to the action callbacks
 */
export function doAction(actionName, ...args) {
  if (!pluginActions.has(actionName)) {
    return;
  }
  
  const actions = pluginActions.get(actionName);
  for (const action of actions) {
    const plugin = registeredPlugins.get(action.pluginId);
    
    // Only run actions for active plugins
    if (plugin && plugin.active) {
      try {
        action.callback(...args);
      } catch (error) {
        console.error(`Error running action '${actionName}' from plugin '${plugin.name}':`, error);
      }
    }
  }
}

/**
 * Apply all registered filters for a specific filter name
 * 
 * @param {string} filterName - Name of the filter to apply
 * @param {any} value - Initial value to filter
 * @param {...any} args - Additional arguments to pass to filter callbacks
 * @returns {any} The filtered value
 */
export function applyFilter(filterName, value, ...args) {
  if (!pluginFilters.has(filterName)) {
    return value;
  }
  
  let filteredValue = value;
  const filters = pluginFilters.get(filterName);
  
  for (const filter of filters) {
    const plugin = registeredPlugins.get(filter.pluginId);
    
    // Only apply filters from active plugins
    if (plugin && plugin.active) {
      try {
        filteredValue = filter.callback(filteredValue, ...args);
      } catch (error) {
        console.error(`Error applying filter '${filterName}' from plugin '${plugin.name}':`, error);
      }
    }
  }
  
  return filteredValue;
}

/**
 * Initialize all registered plugins
 */
export function initializePlugins() {
  for (const [id, plugin] of registeredPlugins.entries()) {
    try {
      // Skip if already deactivated
      if (!plugin.active) continue;
      
      // Run initialization hook if registered
      if (pluginHooks.has(`${id}:initialize`)) {
        const hook = pluginHooks.get(`${id}:initialize`);
        hook();
      }
      
      console.log(`Plugin '${plugin.name}' initialized`);
    } catch (error) {
      console.error(`Failed to initialize plugin '${plugin.name}':`, error);
      
      // Deactivate plugin on initialization failure
      plugin.active = false;
      registeredPlugins.set(id, plugin);
    }
  }
}

// Example built-in plugins
export const builtInPlugins = [
  {
    id: 'stripe-gateway',
    name: 'Stripe Payment Gateway',
    version: '1.2.3',
    author: 'Amal',
    description: 'Accept credit card payments securely with Stripe',
    setup: (api) => {
      // Register activation hook
      api.registerHook('activate', () => {
        console.log('Stripe Payment Gateway activated');
      });
      
      // Add filter to modify checkout payment methods
      api.addFilter('checkout.paymentMethods', (methods) => {
        return [
          ...methods,
          {
            id: 'stripe',
            name: 'Credit Card (Stripe)',
            description: 'Pay securely with your credit or debit card',
            icon: 'CreditCardIcon'
          }
        ];
      });
    }
  },
  {
    id: 'live-chat',
    name: 'Live Chat Support',
    version: '2.0.1',
    author: 'Amal',
    description: 'Real-time customer support chat widget',
    setup: (api) => {
      // Add action to inject chat widget
      api.addAction('app.mounted', () => {
        console.log('Initializing live chat widget');
      });
    }
  }
];