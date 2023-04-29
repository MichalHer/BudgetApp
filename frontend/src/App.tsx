
import './App.css';
// import { Route, Routes, BrowserRouter } from 'react-router-dom';
// import { Home } from './pages/home';
import { Dashboard } from './pages/dashboard';
// import { Accounts } from './pages/accounts';
// import { Categories } from './pages/categories';
import { Operations } from './pages/operations';
// import { Predictions } from './pages/predictions';
// import { Transfers } from './pages/transfers';
// import { InvestmentsRadar } from './pages/investments_radar';
// import { IInvestmentsAssetsOperations } from './pages/investments_assets_operations';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Logout } from './pages/logout';

import AppLayoutComponent from './components/layouts/AppLayout';

import { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import IUser from './types/user.type';

import EventBus from "./common/EventBus";
type Props = {};

type State = {
  showModeratorBoard: boolean,
  showAdminBoard: boolean,
  currentUser: IUser | undefined
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        // showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        // showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }

    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <div>
          <Routes>
            {/* <Route path={["/", "/home"]} component={Home} /> */}
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            {/* <Route path="/profile" component={Profile} /> */}
            {/* <Route path="/user" component={BoardUser} /> */}
            {/* <Route path="/mod" component={BoardModerator} /> */}
            {/* <Route path="/admin" component={BoardAdmin} /> */}
            <Route element={<AppLayoutComponent/>} >
              <Route path="/dashboard" element={<Dashboard/>} />
              {/* <Route path="accounts" element={<Accounts/>} /> */}
              {/* <Route path="categories" element={<Categories/>} /> */}
              <Route path="/operations" element={<Operations/>} />
              {/* <Route path="predictions" element={<Predictions/>} /> */}
              {/* <Route path="transfers" element={<Transfers/>} /> */}
              {/* <Route path="investments/radar" element={<InvestmentsRadar/>} /> */}
              {/* <Route path="investments/operations" element={<IInvestmentsAssetsOperations/>} /> */}
              <Route path="/logout" element={<Logout/>} />
            </Route>
          </Routes>
      </div>  
    );
  }
}

export default App;