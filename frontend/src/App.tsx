import React from 'react';
import './App.css';
import { Sidebar } from './components/sidebar/sidebar';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Home } from './pages/home';
import { Dashboard } from './pages/dashboard';
import { Accounts } from './pages/accounts';
import { Categories } from './pages/categories';
import { Operations } from './pages/operations';
import { Predictions } from './pages/predictions';
import { Transfers } from './pages/transfers';
import { InvestmentsRadar } from './pages/investments_radar';
import { IInvestmentsAssetsOperations } from './pages/investments_assets_operations';

export interface IApplicationProps {};

const App: React.FunctionComponent<IApplicationProps> = (props) => {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="accounts" element={<Accounts/>} />
        <Route path="categories" element={<Categories/>} />
        <Route path="operations" element={<Operations/>} />
        <Route path="predictions" element={<Predictions/>} />
        <Route path="transfers" element={<Transfers/>} />
        <Route path="investments/radar" element={<InvestmentsRadar/>} />
        <Route path="investments/operations" element={<IInvestmentsAssetsOperations/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
