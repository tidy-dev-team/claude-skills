import { __MODULE_PASCAL__UI } from "./plugins/__PLUGIN_ID__/ui";
import "./App.css";

// Standalone shell. In the parent Tidy DS Toolbox this role is filled by the
// toolbox App + module registry; here we render the single module directly.
function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>
          __PLUGIN_NAME__
          <span className="version">v{__APP_VERSION__}</span>
        </h1>
      </header>
      <main className="viewport">
        <div className="viewport-scroll">
          <div className="viewport-content">
            <__MODULE_PASCAL__UI />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
