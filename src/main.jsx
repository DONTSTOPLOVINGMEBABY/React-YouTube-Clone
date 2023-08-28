import React from 'react';
import ReactDOM from 'react-dom/client';
import RouteSwitch from './RouteSwitch';
import { FlagProvider } from "feature-toggles-react-sdk"

const config = {
    apiKey : 'PRODUCTION.rILFDB90thK1U0uF4oFHOUYP4IHh+MqqktWn9inQl89YBdlfeJklH+e+Oo7bInLlWDw4hx3PZMAaPQcCLXdrjQ==', 
    refreshRate : '1s'
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <FlagProvider config={config}>
          <RouteSwitch/>
        </FlagProvider>
);