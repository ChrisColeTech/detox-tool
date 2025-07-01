/**
 * ReactComponentEngine Test Suite
 * Comprehensive tests for ReactComponentEngine
 * 
 * @author Detox-Tool Development Team
 * @phase Phase 4 - React Component Extraction
 * @version 1.0.0
 */

const ReactComponentEngine = require('../../app/core/engines/ReactComponentEngine');

describe('ReactComponentEngine', () => {
  let engine;
  
  beforeEach(() => {
    engine = new ReactComponentEngine();
  });

  describe('Constructor', () => {
    test('should initialize with default options', () => {
      const instance = new ReactComponentEngine();
      expect(instance.options.extractComponents).toBe(true);
      expect(instance.options.reconstructJSX).toBe(true);
      expect(instance.options.analyzeProps).toBe(true);
      expect(instance.options.detectHooks).toBe(true);
      expect(instance.options.mapDependencies).toBe(true);
    });

    test('should accept custom options', () => {
      const options = {
        extractComponents: false,
        maxComponentDepth: 20
      };
      const instance = new ReactComponentEngine(options);
      expect(instance.options.extractComponents).toBe(false);
      expect(instance.options.maxComponentDepth).toBe(20);
    });

    test('should initialize empty statistics', () => {
      expect(engine.statistics.componentsDetected).toBe(0);
      expect(engine.statistics.createElementCallsProcessed).toBe(0);
      expect(engine.statistics.jsxElementsReconstructed).toBe(0);
    });
  });

  describe('Core Processing', () => {
    test('should process simple React code without errors', async () => {
      const code = `
        function SimpleComponent() {
          return React.createElement('div', null, 'Hello World');
        }
      `;
      const result = await engine.process(code);
      
      expect(result.success).toBe(true);
      expect(result.reconstructedCode).toBeDefined();
      expect(result.metadata.processingTime).toBeGreaterThanOrEqual(0);
    });

    test('should handle syntax errors gracefully', async () => {
      const code = 'function Component() { return React.createElement(; }'; // Invalid syntax
      const result = await engine.process(code);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error.phase).toBe('react-component-processing');
    });

    test('should preserve original code on error', async () => {
      const invalidCode = 'invalid javascript code {{{';
      const result = await engine.process(invalidCode);
      
      expect(result.originalCode).toBe(invalidCode);
      expect(result.reconstructedCode).toBe(invalidCode);
    });
  });

  describe('React Pattern Detection', () => {
    test('should detect React.createElement calls', async () => {
      const code = `
        const element1 = React.createElement('div', null);
        const element2 = React.createElement('span', { className: 'test' });
        const element3 = React.createElement(CustomComponent, { prop: 'value' });
      `;
      
      const result = await engine.process(code, { detectReactPatterns: true });
      expect(result.success).toBe(true);
      expect(result.statistics.createElementCallsProcessed).toBe(3);
      expect(result.metadata.reactPatternsFound.length).toBeGreaterThan(0);
      
      const createElementPatterns = result.metadata.reactPatternsFound.filter(p => p.type === 'createElement');
      expect(createElementPatterns).toHaveLength(3);
    });

    test('should detect React components', async () => {
      const code = `
        function MyComponent(props) {
          return React.createElement('div', null, props.children);
        }
        
        function AnotherComponent() {
          return React.createElement('span', null, 'Hello');
        }
      `;
      
      const result = await engine.process(code, { detectReactPatterns: true });
      expect(result.success).toBe(true);
      expect(result.statistics.componentsDetected).toBe(2);
      
      const componentPatterns = result.metadata.reactPatternsFound.filter(p => p.type === 'component');
      expect(componentPatterns).toHaveLength(2);
      expect(componentPatterns[0].name).toBe('MyComponent');
      expect(componentPatterns[1].name).toBe('AnotherComponent');
    });

    test('should detect React hooks', async () => {
      const code = `
        function HookComponent() {
          const [count, setCount] = React.useState(0);
          const [name, setName] = React.useState('test');
          return React.createElement('div', null, count);
        }
      `;
      
      const result = await engine.process(code, { 
        detectReactPatterns: true,
        detectHooks: true 
      });
      expect(result.success).toBe(true);
      expect(result.statistics.hooksDetected).toBe(2);
      
      const hookPatterns = result.metadata.reactPatternsFound.filter(p => p.type === 'hook');
      expect(hookPatterns).toHaveLength(2);
    });
  });

  describe('Component Extraction', () => {
    test('should extract function components', async () => {
      const code = `
        function WelcomeComponent(props) {
          return React.createElement('h1', null, 'Welcome ' + props.name);
        }
        
        function GreetingComponent() {
          return React.createElement('p', null, 'Hello!');
        }
      `;
      
      const result = await engine.process(code, { extractComponents: true });
      expect(result.success).toBe(true);
      expect(Object.keys(result.components)).toHaveLength(2);
      expect(result.components.WelcomeComponent).toBeDefined();
      expect(result.components.GreetingComponent).toBeDefined();
      expect(result.components.WelcomeComponent.type).toBe('function');
      expect(result.components.WelcomeComponent.params).toEqual(['props']);
    });

    test('should extract function expression components', async () => {
      const code = `
        const MyComponent = function(props) {
          return React.createElement('div', null, props.text);
        };
      `;
      
      const result = await engine.process(code, { extractComponents: true });
      expect(result.success).toBe(true);
      expect(Object.keys(result.components)).toHaveLength(1);
      
      const componentName = Object.keys(result.components)[0];
      expect(result.components[componentName].type).toBe('function-expression');
    });

    test('should extract arrow function components', async () => {
      const code = `
        const ArrowComponent = (props) => {
          return React.createElement('button', null, props.label);
        };
      `;
      
      const result = await engine.process(code, { extractComponents: true });
      expect(result.success).toBe(true);
      expect(Object.keys(result.components)).toHaveLength(1);
      
      const componentName = Object.keys(result.components)[0];
      expect(result.components[componentName].type).toBe('arrow-function');
    });
  });

  describe('JSX Reconstruction', () => {
    test('should reconstruct simple JSX elements', async () => {
      const code = `
        const element = React.createElement('div', null, 'Hello World');
      `;
      
      const result = await engine.process(code, { reconstructJSX: true });
      expect(result.success).toBe(true);
      expect(result.statistics.jsxElementsReconstructed).toBe(1);
      expect(result.reconstructedCode).toContain('<div>');
      expect(result.reconstructedCode).toContain('Hello World');
    });

    test('should reconstruct JSX with props', async () => {
      const code = `
        const element = React.createElement('div', { className: 'container', id: 'main' }, 'Content');
      `;
      
      const result = await engine.process(code, { reconstructJSX: true });
      expect(result.success).toBe(true);
      expect(result.reconstructedCode).toContain('className');
      expect(result.reconstructedCode).toContain('id');
    });

    test('should reconstruct self-closing JSX elements', async () => {
      const code = `
        const element = React.createElement('input', { type: 'text', placeholder: 'Enter text' });
      `;
      
      const result = await engine.process(code, { reconstructJSX: true });
      expect(result.success).toBe(true);
      expect(result.reconstructedCode).toContain('<input');
      expect(result.reconstructedCode).toContain('/>');
    });

    test('should reconstruct custom component JSX', async () => {
      const code = `
        const element = React.createElement(CustomButton, { onClick: handleClick }, 'Click me');
      `;
      
      const result = await engine.process(code, { reconstructJSX: true });
      expect(result.success).toBe(true);
      expect(result.reconstructedCode).toContain('<CustomButton');
    });
  });

  describe('Props Analysis', () => {
    test('should analyze component props', async () => {
      const code = `
        const element1 = React.createElement('div', { 
          className: 'container',
          id: 'main',
          onClick: handleClick,
          disabled: true,
          count: 42
        });
        const element2 = React.createElement('span', { title: 'tooltip' });
      `;
      
      const result = await engine.process(code, { analyzeProps: true });
      expect(result.success).toBe(true);
      expect(result.statistics.propsAnalyzed).toBe(6); // 5 + 1 props
    });

    test('should categorize prop types correctly', async () => {
      const code = `
        const element = React.createElement('input', {
          type: 'text',        // string
          maxLength: 100,      // number  
          required: true,      // boolean
          onChange: handler,   // identifier
          onFocus: () => {}    // function
        });
      `;
      
      const result = await engine.process(code, { analyzeProps: true });
      expect(result.success).toBe(true);
      expect(result.statistics.propsAnalyzed).toBe(5);
    });
  });

  describe('Hooks Detection', () => {
    test('should detect useState hooks', async () => {
      const code = `
        function Component() {
          const [count, setCount] = React.useState(0);
          const [name, setName] = React.useState('');
          return React.createElement('div', null);
        }
      `;
      
      const result = await engine.process(code, { detectHooks: true });
      expect(result.success).toBe(true);
      expect(result.statistics.hooksDetected).toBe(2);
    });

    test('should detect various hook types', async () => {
      const code = `
        function Component() {
          const [state, setState] = React.useState(null);
          const ref = React.useRef(null);
          const memoValue = React.useMemo(() => expensive(), [dep]);
          const callback = React.useCallback(() => {}, []);
          
          React.useEffect(() => {}, []);
          
          return React.createElement('div', null);
        }
      `;
      
      const result = await engine.process(code, { detectHooks: true });
      expect(result.success).toBe(true);
      expect(result.statistics.hooksDetected).toBe(5);
    });

    test('should detect hooks without React namespace', async () => {
      const code = `
        function Component() {
          const [count, setCount] = useState(0);
          const value = useMemo(() => compute(), []);
          return React.createElement('div', null);
        }
      `;
      
      const result = await engine.process(code, { detectHooks: true });
      expect(result.success).toBe(true);
      expect(result.statistics.hooksDetected).toBe(2);
    });
  });

  describe('Dependency Mapping', () => {
    test('should map component dependencies', async () => {
      const code = `
        function ParentComponent() {
          return React.createElement('div', null,
            React.createElement(ChildComponent, null),
            React.createElement(AnotherChild, { prop: 'value' })
          );
        }
        
        function AnotherParent() {
          return React.createElement(SharedComponent, null);
        }
      `;
      
      const result = await engine.process(code, { mapDependencies: true });
      expect(result.success).toBe(true);
      expect(result.statistics.dependenciesMapped).toBe(3);
      expect(Object.keys(result.dependencies)).toHaveLength(2);
    });

    test('should ignore native HTML elements in dependencies', async () => {
      const code = `
        function Component() {
          return React.createElement('div', null,
            React.createElement('span', null, 'text'),
            React.createElement(CustomComponent, null)
          );
        }
      `;
      
      const result = await engine.process(code, { mapDependencies: true });
      expect(result.success).toBe(true);
      expect(result.statistics.dependenciesMapped).toBe(1); // Only CustomComponent
    });
  });

  describe('Event Handler Extraction', () => {
    test('should extract event handlers', async () => {
      const code = `
        const element = React.createElement('button', {
          onClick: handleClick,
          onMouseOver: () => console.log('hover'),
          onFocus: handleFocus,
          onBlur: handleBlur
        });
      `;
      
      const result = await engine.process(code, { extractEventHandlers: true });
      expect(result.success).toBe(true);
      expect(result.statistics.eventHandlersExtracted).toBe(4);
    });

    test('should identify handler types', async () => {
      const code = `
        const element = React.createElement('input', {
          onChange: handleChange,           // identifier
          onKeyPress: (e) => process(e),   // function
          onFocus: handleFocus             // identifier
        });
      `;
      
      const result = await engine.process(code, { extractEventHandlers: true });
      expect(result.success).toBe(true);
      expect(result.statistics.eventHandlersExtracted).toBe(3);
    });
  });

  describe('State Analysis', () => {
    test('should analyze state variables', async () => {
      const code = `
        function Component() {
          const [count, setCount] = React.useState(0);
          const [name, setName] = React.useState('John');
          const [isVisible, setIsVisible] = React.useState(true);
          
          return React.createElement('div', null);
        }
      `;
      
      const result = await engine.process(code, { analyzeState: true });
      expect(result.success).toBe(true);
      expect(result.statistics.stateVariablesFound).toBe(3);
    });

    test('should extract state variable names and setters', async () => {
      const code = `
        function Component() {
          const [user, setUser] = React.useState({ name: 'Test' });
          return React.createElement('div', null);
        }
      `;
      
      const result = await engine.process(code, { analyzeState: true });
      expect(result.success).toBe(true);
      expect(result.statistics.stateVariablesFound).toBe(1);
    });
  });

  describe('Options and Configuration', () => {
    test('should respect disabled options', async () => {
      const engineWithOptions = new ReactComponentEngine({
        extractComponents: false,
        reconstructJSX: false,
        detectHooks: false
      });
      
      const code = `
        function Component() {
          const [state, setState] = React.useState(0);
          return React.createElement('div', null, 'Test');
        }
      `;
      
      const result = await engineWithOptions.process(code);
      expect(result.success).toBe(true);
      expect(result.statistics.componentsDetected).toBe(0);
      expect(result.statistics.jsxElementsReconstructed).toBe(0);
      expect(result.statistics.hooksDetected).toBe(0);
    });

    test('should allow runtime option overrides', async () => {
      const code = `
        function Component() {
          return React.createElement('div', null);
        }
      `;
      
      const result = await engine.process(code, {
        extractComponents: false
      });
      
      expect(result.success).toBe(true);
      expect(Object.keys(result.components)).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSX gracefully', async () => {
      const code = 'const element = React.createElement(';
      const result = await engine.process(code);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.metadata.warnings.length).toBeGreaterThan(0);
    });

    test('should provide detailed error information', async () => {
      const code = 'function Component() { return React.createElement(; }';
      const result = await engine.process(code);
      
      expect(result.success).toBe(false);
      expect(result.error.message).toBeDefined();
      expect(result.error.phase).toBe('react-component-processing');
      expect(result.error.stack).toBeDefined();
    });
  });

  describe('Statistics and Metadata', () => {
    test('should track processing statistics', async () => {
      const code = `
        function App() {
          const [count, setCount] = React.useState(0);
          return React.createElement('div', { onClick: handleClick },
            React.createElement(Header, null),
            React.createElement(Counter, { value: count })
          );
        }
      `;
      
      const result = await engine.process(code);
      expect(result.success).toBe(true);
      expect(result.statistics).toBeDefined();
      expect(result.statistics.createElementCallsProcessed).toBeGreaterThan(0);
      expect(result.statistics.componentsDetected).toBeGreaterThan(0);
    });

    test('should record processing time', async () => {
      const code = 'const element = React.createElement("div", null);';
      const result = await engine.process(code);
      
      expect(result.success).toBe(true);
      expect(result.metadata.processingTime).toBeGreaterThanOrEqual(0);
    });

    test('should provide reconstruction details', async () => {
      const code = 'const element = React.createElement("span", null, "text");';
      const result = await engine.process(code, { reconstructJSX: true });
      
      expect(result.success).toBe(true);
      expect(result.metadata.reconstructions).toBeDefined();
      expect(Array.isArray(result.metadata.reconstructions)).toBe(true);
    });
  });

  describe('Status and Utilities', () => {
    test('should return implementation status', () => {
      const status = engine.getStatus();
      
      expect(status.implemented).toBe(true);
      expect(status.phase).toBe('Phase 4');
      expect(status.version).toBe('1.0.0');
      expect(status.capabilities).toContain('react-component-detection');
      expect(status.capabilities).toContain('createElement-to-jsx-reconstruction');
      expect(status.capabilities).toContain('component-props-analysis');
    });

    test('should provide current statistics', () => {
      const stats = engine.getStatistics();
      
      expect(stats).toBeDefined();
      expect(stats.componentsDetected).toBeDefined();
      expect(stats.createElementCallsProcessed).toBeDefined();
      expect(stats.jsxElementsReconstructed).toBeDefined();
    });

    test('should reset state properly', () => {
      engine.statistics.componentsDetected = 5;
      engine.reset();
      
      expect(engine.statistics.componentsDetected).toBe(0);
      expect(engine.components.size).toBe(0);
      expect(engine.dependencies.size).toBe(0);
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle complex React applications', async () => {
      const code = `
        function App() {
          const [user, setUser] = React.useState(null);
          const [loading, setLoading] = React.useState(true);
          
          React.useEffect(() => {
            fetchUser().then(setUser).finally(() => setLoading(false));
          }, []);
          
          if (loading) {
            return React.createElement(LoadingSpinner, null);
          }
          
          return React.createElement('div', { className: 'app' },
            React.createElement(Header, { user: user }),
            React.createElement(MainContent, { 
              user: user,
              onUserUpdate: setUser
            }),
            React.createElement(Footer, null)
          );
        }
        
        function Header({ user }) {
          return React.createElement('header', null,
            React.createElement('h1', null, 'Welcome ' + (user ? user.name : 'Guest'))
          );
        }
      `;
      
      const result = await engine.process(code);
      expect(result.success).toBe(true);
      expect(result.statistics.componentsDetected).toBe(2);
      expect(result.statistics.createElementCallsProcessed).toBeGreaterThan(5);
      expect(result.statistics.hooksDetected).toBeGreaterThan(0);
    });

    test('should preserve component semantics', async () => {
      const code = `
        function TodoItem({ todo, onToggle, onDelete }) {
          const handleToggle = React.useCallback(() => {
            onToggle(todo.id);
          }, [todo.id, onToggle]);
          
          return React.createElement('li', { 
            className: todo.completed ? 'completed' : 'pending' 
          },
            React.createElement('input', {
              type: 'checkbox',
              checked: todo.completed,
              onChange: handleToggle
            }),
            React.createElement('span', null, todo.text),
            React.createElement('button', {
              onClick: () => onDelete(todo.id)
            }, 'Delete')
          );
        }
      `;
      
      const result = await engine.process(code);
      expect(result.success).toBe(true);
      expect(result.components.TodoItem).toBeDefined();
      expect(result.components.TodoItem.params).toEqual(['todo', 'onToggle', 'onDelete']);
    });
  });
});