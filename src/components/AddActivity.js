import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { OutlinedInput } from "@material-ui/core";

class AddActivity extends Component {
  state = {
    open: false,
    activity: "",
    duration: "",
    date: ""
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  saveActivity = () => {
    const newActivity = {
      activity: this.state.activity,
      duration: this.state.duration,
      date: new Date(this.state.date),
      customer: this.props.customer
    };

    this.props.addActivity(newActivity);
    this.handleClose();
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          New Activity
        </Button>
        <Dialog
          style={{ marigin: 10 }}
          variant="outlined"
          color="primary"
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">New Activity</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="activity"
              value={this.state.activity}
              onChange={this.handleChange}
              label="Activity"
              fullWidth
            />
            <TextField
              margin="dense"
              name="duration"
              value={this.state.duration}
              onChange={this.handleChange}
              label="Duration"
              fullWidth
            />
            <TextField
              margin="dense"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              label="Date"
              type="datetime-local"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.saveActivity} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AddActivity;
