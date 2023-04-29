import { Component } from "react";
import { Navigate } from "react-router-dom";
import OperationsService from "../services/operations.service";
import IOperation from "../types/operation.type";
import TableComponent from "../components/table/Table"
import authService from "../services/auth.service";
type Props = {};

type State = {
    content: Array<IOperation>
    redirect: string | null
}

export class Operations extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            content: [],
            redirect: null
        };
    }
    
    componentDidMount() {
        OperationsService.getOperations().then(
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
        let table_content:Array<object> = []
        this.state.content.forEach(element => {
            let prediction_name = ''
            if (element.predictions != null) {
                prediction_name = element.predictions.purpose_of_the_expendture
            }
            table_content.push({
                id:element.ID_Op,
                account_name:element.accounts.name,
                category_name:element.categories.name,
                prediction_name:prediction_name,
                expendture:element.purpose_of_the_expendture,
                value:`${element.value} ${element.accounts?.currency}`
            })
        })

        return (
            <div>
                <h1>Operations</h1>
                <TableComponent 
                    table_headers={["Operation ID", "Account", "Category Name", "Prediction Name", "Operation Name", "Value"]}
                    table_content={table_content}    
                />
            </div>
        );
    }
}