import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import AddCustomer from "./AddCustomer";
import AddActivity from "./AddActivity";
import BigCalendar from "react-big-calendar";
import moment, { locale } from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      activities: [],
      allActivities: [],
      open: false,
      message: "",
      link: ""
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    this.setState({
      showActivities: false,
      showCustomers: true,
      showCalendar: false
    });
    fetch("https://customerrest.herokuapp.com/api/customers")
      .then(res => res.json())
      .then(jsondata => this.setState({ customers: jsondata.content }));
  };

  fetchActivities = link => {
    this.setState({
      showActivities: true,
      showCustomers: false,
      showCalendar: false
    });
    fetch(link)
      .then(res => res.json())
      .then(jsondata => this.setState({ activities: jsondata.content }));
  };

  fetchAllActivities = () => {
    this.setState({
      showActivities: false,
      showCustomers: false,
      showCalendar: true
    });
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then(res => res.json())
      .then(jsondata => this.setState({ allActivities: jsondata }));
  };

  addCustomer = newCustomer => {
    fetch("https://customerrest.herokuapp.com/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCustomer)
    })
      .then(res => this.fetchCustomers())
      .then(res => this.setState({ open: true, message: "New Customer added" }))
      .catch(err => console.error(err));
  };

  addActivity = newActivity => {
    fetch("https://customerrest.herokuapp.com/api/trainings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newActivity)
    })
      .then(res => this.fetchCustomers())
      .then(res => this.setState({ open: true, message: "New Activity added" }))
      .catch(err => console.error(err));
  };

  deleteCustomer = link => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then(res => this.fetchCustomers())
        .then(res => this.setState({ open: true, message: "Customer deleted" }))
        .catch(err => console.error(err));
    }
  };

  deleteActivity = link => {
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" })
        .then(res => this.fetchCustomers())
        .then(res => this.setState({ open: true, message: "Activity deleted" }))
        .catch(err => console.error(err));
    }
  };

  render() {
    const columns = [
      {
        Header: "First name",
        accessor: "firstname"
      },
      {
        Header: "Last name",
        accessor: "lastname"
      },
      {
        Header: "Street address",
        accessor: "streetaddress"
      },
      {
        Header: "Postcode",
        accessor: "postcode"
      },
      {
        Header: "City",
        accessor: "city"
      },
      {
        Header: "Email",
        accessor: "email"
      },
      {
        Header: "Phone",
        accessor: "phone"
      },
      {
        Header: "",
        filterable: false,
        sortable: false,
        width: 100,
        accessor: "links[2].href",
        Cell: ({ value, row }) => (
          <Button color="primary" onClick={() => this.fetchActivities(value)}>
            ACTIVITIES
          </Button>
        )
      },

      {
        Header: "",
        accessor: "links[0].href",
        sortable: false,
        filterable: false,
        width: 180,
        Cell: ({ value }) => (
          <AddActivity
            addActivity={this.addActivity}
            fetchCustomers={this.fetchCustomers}
            customer={value}
          />
        )
      },

      {
        Header: "",
        filterable: false,
        sortable: false,
        width: 90,
        accessor: "links[0].href",
        Cell: ({ value }) => (
          <Button
            color="secondary"
            size="small"
            onClick={() => this.deleteCustomer(value)}
          >
            DELETE
          </Button>
        )
      }
    ];

    const columns2 = [
      {
        Header: "Date",
        accessor: "date",
        Cell: props => <>{moment.utc(props.value).format("DD-MM-YYYY HH.mm")}</>
      },
      {
        Header: "Duration (min)",
        accessor: "duration"
      },
      {
        Header: "Activity",
        accessor: "activity"
      },
      {
        Header: "",
        filterable: false,
        sortable: false,
        width: 90,
        accessor: "links[0].href",
        Cell: ({ value }) => (
          <Button
            color="secondary"
            size="small"
            onClick={() => this.deleteActivity(value)}
          >
            DELETE
          </Button>
        )
      }
    ];

    const { showActivities, showCustomers, showCalendar } = this.state;

    const localizer = BigCalendar.momentLocalizer(moment);
    const caledarEvents = [];

    for (let i = 0; i < this.state.allActivities.length; i++) {
      const event = {
        id: i,
        start: moment.utc(this.state.allActivities[i].date)._d,
        end: moment
          .utc(this.state.allActivities[i].date)
          .add(this.state.allActivities[1].duration, "minute")._d,
        title: this.state.allActivities[i].activity
      };
      caledarEvents.push(event);
    }

    return (
      <>
        {showCustomers && (
          <>
            <Button color="primary" onClick={() => this.fetchAllActivities()}>
              CALENDAR
            </Button>
            <AddCustomer addCustomer={this.addCustomer} />
            <ReactTable
              filterable={true}
              data={this.state.customers}
              columns={columns}
            />
          </>
        )}
        {showActivities && (
          <>
            <Button color="primary" onClick={() => this.fetchAllActivities()}>
              CALENDAR
            </Button>
            <br />
            <Button
              color="primary"
              onClick={() =>
                this.setState({
                  showActivities: false,
                  showCustomers: true,
                  showCalendar: false
                })
              }
            >
              CUSTOMERS
            </Button>
            <ReactTable
              filterable={true}
              data={this.state.activities}
              columns={columns2}
            />
          </>
        )}

        {showCalendar && (
          <>
            <Button
              color="primary"
              onClick={() =>
                this.setState({
                  showActivities: false,
                  showCustomers: true,
                  showCalendar: false
                })
              }
            >
              CUSTOMERS
            </Button>
            <div style={{ height: 500 }}>
              <BigCalendar
                localizer={localizer}
                events={caledarEvents}
                views={["month", "week", "day"]}
                defaultDate={new Date()}
              />
            </div>
          </>
        )}

        <Snackbar
          open={this.state.open}
          autoHideDuration={3000}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          message={this.state.message}
        />
      </>
    );
  }
}

export default CustomerList;
