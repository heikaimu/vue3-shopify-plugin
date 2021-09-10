export default {
  install: function(Vue) {
    const requireComponent = require.context('.', true, /\.vue$/);
    requireComponent.keys().forEach(key => {
      const componentConfig = requireComponent(key);
      const componentName = componentConfig.default.name;
      if (componentName) {
        Vue.component(componentName, componentConfig.default || componentConfig);
      }
    });
  }
};
