import { Component } from "react";
import { Navigate } from "react-router-dom";
import OperationsService from "../services/operations.service";
import IOperation from "../types/operation.type";
import TableComponent from "../components/table/Table"
import authService from "../services/auth.service";
type Props = {};

type State = {
    content: Array<IOperation>
    redirect: string
}

export class Logout extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            content: [],
            redirect: "/login"
        };
    }
    
    componentDidMount() {
        authService.logout()
    }

    render() {
        return <Navigate to={this.state.redirect} />
    }
}