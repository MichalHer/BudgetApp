import { Component } from "react";
import DashboardService from "../services/dashboard.service";
import authService from "../services/auth.service";
import { Navigate } from "react-router-dom";

type Props = {};

type State = {
    content: string
    redirect: string | null
}

export class Dashboard extends Component<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = {
          content: "",
          redirect: null
      };
    }
    componentDidMount() {
      DashboardService.getDashboardContent().then(
        response => {
          this.setState({
            content: response.data
          });
        },
        error => {
          authService.logout()
          this.setState({
            content:
              (error.response && error.response.data) ||
              error.message ||
              error.toString()
          });
          this.setState({
            redirect: "/login"
          });
          }
        );
    }
    render() {
      if (this.state.redirect) {
        return <Navigate to={this.state.redirect} />
      }
      return (
          <div>
              <h1>Dashboard</h1>
          </div>
      );
    }
}