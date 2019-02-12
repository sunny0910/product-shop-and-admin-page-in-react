import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import {
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  LinearProgress,
  Snackbar,
  TableSortLabel,
  TablePagination
} from "@material-ui/core";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Eye from "@material-ui/icons/RemoveRedEye";
import CheckBox from "@material-ui/icons/CheckBox";
import { Link } from "react-router-dom";
import TableToolBar from "./tableToolBar";
import apiRequest from "../../apiRequest";
import apiUrl from "../../apiUrl";

class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerLoading: true,
      linearLoading: false,
      selected: [],
      selectedCount: 0,
      mainCheckBoxSelected: false,
      mainCheckBoxColor: "inherit",
      deleteNotification: false,
      rowsPerPage: 5,
      page: 0,
      orderBy: "Email",
      order: "asc"
    };
    this.mainCheckboxOnChange = this.mainCheckboxOnChange.bind(this);
    this.checkboxOnChange = this.checkboxOnChange.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.deleteMultipleRows = this.deleteMultipleRows.bind(this);
    this.hideDeleteNotification = this.hideDeleteNotification.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.changeOrderOrOrderBy = this.changeOrderOrOrderBy.bind(this);
    this.stableSort = this.stableSort.bind(this);
  }

  mainCheckboxOnChange(e) {
    this.setState((state, props) => ({
      selected: state.mainCheckBoxSelected
        ? []
        : props.users.map(row => row.id),
      selectedCount: state.mainCheckBoxSelected ? 0 : props.users.length,
      mainCheckBoxSelected: !state.mainCheckBoxSelected,
      mainCheckBoxColor: state.mainCheckBoxSelected ? "inherit" : "secondary"
    }));
  }

  checkboxOnChange(e, id) {
    let mainCheckBoxColor, mainCheckBoxSelected;

    let newSelectedArray = this.state.selected.slice(0);
    let checkboxAlreadySelected = this.state.selected.includes(id);

    checkboxAlreadySelected
      ? newSelectedArray.pop(id)
      : newSelectedArray.push(id);

    if (newSelectedArray.length === this.props.users.length) {
      mainCheckBoxSelected = true;
      mainCheckBoxColor = "secondary";
    } else {
      mainCheckBoxSelected = false;
      mainCheckBoxColor = "inherit";
    }
    this.setState(prevState => ({
      selected: newSelectedArray,
      selectedCount: checkboxAlreadySelected
        ? prevState.selectedCount - 1
        : prevState.selectedCount + 1,
      mainCheckBoxColor: mainCheckBoxColor,
      mainCheckBoxSelected: mainCheckBoxSelected
    }));
  }

  isSelected(id) {
    if (this.state.selected.indexOf(id) === -1) {
      return false;
    }
    return true;
  }

  deleteRow(id) {
    this.setState({ linearLoading: true });
    apiRequest(apiUrl + "/users/" + id, "DELETE", "", this.props.token)
      .then(result => {
        if (result.status === 500) {
          this.props.serverError(true);
          return;
        }
        result
          .json()
          .then(res => {
            setTimeout(
              id =>
                this.setState(
                  { linearLoading: false, deleteNotification: true },
                  () => this.props.updateUserList(id)
                ),
              500,
              res.id
            );
          })
          .catch(err => {
            console.log(err);
            this.props.serverError(true);
          });
      })
      .catch(err => {
        this.props.serverError(true);
      });
  }

  deleteMultipleRows() {
    this.setState({ linearLoading: true });
    let data = JSON.stringify(this.state.selected);
    apiRequest(apiUrl + "/users", "DELETE", data, this.props.token)
      .then(result => {
        if (result.status === 500) {
          this.props.serverError(true);
          return;
        }
        result
          .json()
          .then(res => {
            setTimeout(
              ids =>
                this.setState(
                  {
                    linearLoading: false,
                    deleteNotification: true,
                    selected: [],
                    selectedCount: 0
                  },
                  () => this.props.updateUserList(ids)
                ),
              500,
              res.ids
            );
          })
          .catch(err => {
            console.log(err);
            this.props.serverError(true);
          });
      })
      .catch(err => {
        this.props.serverError(true);
      });
  }

  hideDeleteNotification() {
    this.setState({
      deleteNotification: false
    });
  }

  handlePageChange(event, page) {
    this.setState({
      page: page
    });
  }

  handleChangeRowsPerPage(event) {
    this.setState({
      rowsPerPage: event.target.value
    });
  }

  changeOrderOrOrderBy(event, column) {
    let order = "asc";
    if (column === this.state.orderBy && this.state.order === "asc") {
      order = "desc";
    }
    this.setState({
      orderBy: column,
      order: order
    });
  }

  stableSort(allUsers) {
    allUsers.sort((a, b) => {
      if (this.state.orderBy === "Role") {
        if (this.state.order === "asc") {
          return a.role - b.role;
        } else {
          return b.role - a.role;
        }
      }
      if (this.state.orderBy === "FirstName") {
        let afirstName = a.firstName.toUpperCase();
        let bfirstName = b.firstName.toUpperCase();
        if (this.state.order === "asc") {
          return (afirstName < bfirstName) ? -1 : (afirstName > bfirstName) ? 1 : 0;
        } else {
          return (afirstName > bfirstName) ? -1 : (afirstName < bfirstName) ? 1 : 0;
        }
      }
      if (this.state.orderBy === "SecondName") {
        let asecondName = a.secondName.toUpperCase();
        let bsecondName = b.secondName.toUpperCase();
        if (this.state.order === "asc") {
          return (asecondName < bsecondName) ? -1 : (asecondName > bsecondName) ? 1 : 0;
        } else {
          return (asecondName > bsecondName) ? -1 : (asecondName < bsecondName) ? 1 : 0;
        }
      }
      if (this.state.orderBy === "Email") {
        let aemail = a.email.toUpperCase();
        let bemail = b.email.toUpperCase();
        if (this.state.order === "asc") {
          return (aemail < bemail) ? -1 : (aemail > bemail) ? 1 : 0;
        } else {
          return (aemail > bemail) ? -1 : (aemail < bemail) ? 1 : 0;
        }
      }
      return a - b;
    });
    let start = this.state.page * this.state.rowsPerPage;
    let end = start + this.state.rowsPerPage;
    const users = allUsers.slice(start, end);
    return users;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ spinnerLoading: false });
    }, 500);
  }

  render() {
    const anchorOrigin = { horizontal: "center", vertical: "bottom" };
    return (
      <Paper className="data-table">
        {this.state.deleteNotification ? (
          <Snackbar
            autoHideDuration={1500}
            anchorOrigin={anchorOrigin}
            open
            onClose={this.hideDeleteNotification}
            message="User Deleted!"
          />
        ) : (
          ""
        )}
        {this.state.linearLoading ? <LinearProgress color="secondary" /> : ""}
        <TableToolBar
          selectedCount={this.state.selectedCount}
          deleteMultipleRows={this.deleteMultipleRows}
          hideDeleteNotification={this.hideDeleteNotification}
        />
        {this.state.spinnerLoading ? (
          <CircularProgress
            color="primary"
            variant="indeterminate"
            className="loader"
          />
        ) : (
          <React.Fragment>
            <Table padding="checkbox">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <CheckBox
                      checked={true}
                      color={this.state.mainCheckBoxColor}
                      value="main"
                      onClick={this.mainCheckboxOnChange}
                    />
                  </TableCell>
                  {this.props.columns.map((column, index) => {
                    return (
                      <TableCell key={index}>
                        <Tooltip title="Sort" placement={"left"}>
                          <TableSortLabel
                            direction={this.state.order}
                            active={this.state.orderBy === column}
                            onClick={event =>
                              this.changeOrderOrOrderBy(event, column)
                            }
                          >
                            {column}
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.stableSort(this.props.users).map((user, index) => {
                  const isSelected = this.isSelected(user.id);
                  return (
                    <TableRow key={index} hover selected={isSelected}>
                      <TableCell>
                        <CheckBox
                          selected={isSelected}
                          onClick={event =>
                            this.checkboxOnChange(event, user.id)
                          }
                          color={isSelected ? "secondary" : "inherit"}
                        />
                      </TableCell>
                      <TableCell>{user.firstName}</TableCell>
                      <TableCell>{user.secondName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{this.props.getUserRole(user.role)}</TableCell>
                      <TableCell>
                        <Link to={user.url.view} className="actions">
                          <Tooltip
                            title="View"
                            enterDelay={300}
                            placement={"left"}
                          >
                            <IconButton aria-label="View">
                              <Eye />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={user.url.edit} className="actions">
                          <Tooltip
                            title="Edit"
                            enterDelay={300}
                            placement={"left"}
                          >
                            <IconButton aria-label="Edit">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title="Delete"
                          enterDelay={300}
                          placement={"left"}
                        >
                          <div>
                            <IconButton
                              disabled={this.props.userId === user.id}
                              aria-label="Delete"
                              onClick={() => this.deleteRow(user.id)}
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={this.props.users.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </React.Fragment>
        )}
      </Paper>
    );
  }
}

export default DataTable;
