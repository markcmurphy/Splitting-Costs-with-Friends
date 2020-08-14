import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { compose } from "redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";

import AsyncCreatableSelect from "react-select/async-creatable";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { FormGroup } from "@material-ui/core";

class MaterialAddNewTrip extends Component {
  state = {
    showForm: false,
    tripName: "",
    inputValue: "",
    friendsInvolved: [""],
    // tripID: "",
  };

  inputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  formSubmit = (e) => {
    e.preventDefault();
    const { tripName, friendsInvolved } = this.state;
    const { firestore, uid } = this.props;
    const docRefConfig = {
      collection: "trips",
      // doc: uid,
      // subcollections: [{ collection: "trips" }],
    };
    const tripInfo = {
      tripName: tripName,
      tripOwner: uid,
      friendsInvolved: friendsInvolved,
    };

    let tripID = [];

    firestore.add(docRefConfig, tripInfo).then((docRef) => {
      // this.setState({ tripID: docRef.id });
      // this.tripID = docRef.id;
      for (const friend of friendsInvolved) {
        // console.log(this.state.tripID);
        firestore.update(
          {
            collection: "users",
            // where: [["id", "==", friend]],
            doc: friend,
            // subcollections: [{ collection: "onTrips" }],
          },
          { onTrips: firestore.FieldValue.arrayUnion(docRef.id) }
        );
      }
      console.log("Document written with ID: ", docRef.id);
    });

    // for (const friend of friendsInvolved) {
    //   // console.log(this.state.tripID);
    //   firestore.update(
    //     {
    //       collection: "users",
    //       // where: [["id", "==", friend]],
    //       doc: friend,
    //       // subcollections: [{ collection: "onTrips" }],
    //     },
    //     { tripID: tripID }
    //   );
    // }

    // firestore.add(docRefConfig, tripInfo).then((docRef) => {
    //   console.log("Document written with ID: ", docRef.id);
    // });

    this.setState({
      tripName: "",
      showForm: false,
    });
  };

  closeForm = () => {
    const { showForm } = this.state;

    this.setState({
      showForm: false,
    });
  };

  inputChangeMultiple = (e) => {
    // console.log(e.target.selectedOptions);
    this.setState({
      friendsInvolved: Array.from(
        e.target.selectedOptions,
        (item) => item.value
      ),
      // friendsInvolved: e.target.selectedOptions,
    });
  };

  renderFriendsInvolved() {
    const { friends } = this.props;
    const { friendsInvolved } = this.state;

    // const filterColors = (inputValue) => {
    //   console.log(friends);
    //   if (!isEmpty(friends)) {
    //     return friends.filter((i) =>
    //       // (i) => console.log(i)
    //       i.firstName.toLowerCase().includes(inputValue.toLowerCase())
    //     );
    //   }
    // };

    // const loadOptions = (inputValue, callback) => {
    //   setTimeout(() => {
    //     callback(filterColors(inputValue));
    //   }, 1000);
    // };

    // const handleInputChange = (newValue) => {
    //   const inputValue = newValue.replace(/\W/g, "");
    //   this.setState({ inputValue: inputValue });
    //   return inputValue;
    // };
    const friendSelectMultiple = (
      // todo: finish setting up async-creatable select
      // <AsyncCreatableSelect
      //   cacheOptions
      //   isMulti
      //   defaultOptions={friends}
      //   loadOptions={loadOptions}
      //   onInputChange={handleInputChange}
      // />
      <Select
        multiple
        native
        value={friendsInvolved}
        onChange={this.inputChangeMultiple}
        // className="form-control"
        // id="friendsInvolved"
        // type="text"
        inputProps={{
          id: "select-multiple-native",
        }}
        fullWidth
      >
        {_.map(friends, (value, key) => {
          return (
            <option key={key} value={value.id}>
              {value.firstName}
            </option>
          );

          // return <FriendsInvolved key={value.id} friends={value} />;
        })}
      </Select>
    );
    return friendSelectMultiple;
  }

  renderForm = () => {
    const { showForm, tripName } = this.state;
    const marginBottom = "15px";
    // console.log(this.props);

    if (showForm) {
      return (
        <Dialog
          open={showForm}
          onClose={() => this.closeForm()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add New Trip</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your new trip details here!
            </DialogContentText>
            <form onSubmit={this.formSubmit} id="newTripForm">
              <FormGroup>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel>Trip Name</InputLabel>
                  <Input
                    autoFocus
                    // margin="dense"
                    id="tripName"
                    //   label="Expense Name"
                    type="text"
                    name="tripName"
                    value={tripName}
                    // className="form-control"
                    onChange={this.inputChange}
                    fullWidth
                  />
                  {/* {console.log(this.state.expense)} */}
                </FormControl>
                <FormControl style={{ marginBottom: marginBottom }}>
                  <InputLabel shrink htmlFor="select-multiple-native">
                    Friends Involved
                  </InputLabel>

                  <pre>inputValue: "{this.state.inputValue}"</pre>
                  {/* <InputLabel>Friends Involved</InputLabel> */}
                  {this.renderFriendsInvolved()}
                </FormControl>
                <Button
                  type="submit"
                  //   value="Submit"
                  //   onClick={() => this.closeForm()}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "30px" }}
                  form="newTripForm"
                >
                  Submit{" "}
                </Button>
              </FormGroup>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.closeForm()} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  };

  render() {
    const { showForm } = this.state;

    return (
      <div>
        {showForm ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Close
          </Button>
        ) : (
          // <button
          //   className="btn btn-danger btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Close
          // </button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ showForm: !showForm })}
          >
            Add Trip
          </Button>
          // <button
          //   className="btn btn-secondary btn-block"
          //   onClick={() => this.setState({ showForm: !showForm })}
          // >
          //   Add Trip{" "}
          // </button>
        )}
        <div>
          <div className="">{this.renderForm()}</div>
        </div>
      </div>
    );
  }
}

// export default compose(
//   firestoreConnect((props) => [
//     {
//       collection: "expenses",
//       storeAs: "expense",
//     },
//     {
//       collection: "friends",
//       storeAs: "friend",
//     },
//     {
//       collection: "users",
//       doc: props.uid,
//       subcollections: [{ collection: "trips" }],
//       storeAs: `${props.uid}-trips`,
//     },
//   ]),
//   connect(({ firestore: { data } }, props) => ({
//     expenses: data.expenses,
//     friends: data.friends,
//     trips: data[`${props.uid}-trips`],
//   }))
// )(MaterialAddNewTrip);
export default compose(
  firestoreConnect((props) => [
    {
      collection: "users",
      doc: props.uid,
      storeAs: `${props.id}-contacts`,
      subcollections: [{ collection: "contacts" }],
    },
  ]),

  connect(({ firestore: { ordered } }, props) => ({
    friends: ordered[`${props.id}-contacts`],
    // expenses: ordered[`${props.id}-expenses`],
  }))
)(MaterialAddNewTrip);