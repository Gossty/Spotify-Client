import React from 'react';
import App from "./components/App";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';



const container = document.getElementById('app');
const root = createRoot(container);
root.render(
        <App tab="home" />
);