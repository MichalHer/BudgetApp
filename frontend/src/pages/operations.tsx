import { Component } from "react";
import { Navigate } from "react-router-dom";
import OperationsService from "../services/operations.service";
import IOperation from "../types/operation.type";
import authService from "../services/auth.service";
import TableComponent from "../components/table/table";
type Props = {};

type State = {
    content: Array<IOperation>
    redirect: string | null
    current_page: number
    on_page: number
}

export class Operations extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            content: [],
            redirect: null,
            current_page: 1,
            on_page: 1
        };
    }

    refresh_component() {
        OperationsService.getOperations(this.state.current_page,
                                        this.state.on_page).then(
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

    next_page() {
        let new_page = this.state.current_page + 1;
        this.setState({
            current_page: new_page
        });
        this.refresh_component();
    }
    
    prev_page() {
        if (this.state.current_page > 1){
            let new_page = this.state.current_page - 1;
            this.setState({
                current_page: new_page
            });
            this.refresh_component();
        }
    }

    componentDidMount() {
        this.refresh_component()
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
            <>
            <div>
                <h1>Operations</h1>
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                        <li className="page-item">
                        <a className="page-link" href="#" aria-label="Previous" onClick={this.prev_page}>
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">Previous</span>
                        </a>
                        </li>
                        <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next" onClick={this.next_page}>
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Next</span>
                        </a>
                        </li>
                    </ul>
                </nav>
                <TableComponent 
                    table_headers={["Operation ID", "Account", "Category Name", "Prediction Name", "Operation Name", "Value"]}
                    table_content={table_content}    
                />
            </div>
            </>
        );
    }
}