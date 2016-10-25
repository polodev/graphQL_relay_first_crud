import React from 'react';
import Relay from 'react-relay';
import DeletePersonMutation from '../mutation/DeletePersonMutation.js'
import AddPersonMutation from '../mutation/AddPersonMutation.js'
import EditPersonMutation from '../mutation/EditPersonMutation.js'
class App extends React.Component {
  deletePerson = (id) => {
    let person = {
      id
    }
    Relay.Store.commitUpdate(
        new DeletePersonMutation({person, viewer : this.props.viewer})
      )
  }
  state = {
    firstName : "",
    lastName : "",
    node : "",
    editMode : false
  }
  addPerson = (e) => {
    e.preventDefault();
    let person = {
      firstName : this.refs.firstName.value,
      lastName : this.refs.lastName.value
    } 

      this.refs.firstName.value = "";
      this.refs.lastName.value = ""

    this.setState(person);
    console.log("person", person);
    Relay.Store.commitUpdate(
        new AddPersonMutation({
          person,
          viewer : this.props.viewer
        })
      )

  }
  editMode = (node) => {
    this.setState({
      editMode : true,
      node : node
    });
  }
  editPerson = (e) => {
    e.preventDefault();
    let firstName = this.refs.editFirstName.value 
    let lastName = this.refs.editLastName.value 
    let person = {
      id : this.state.node.id, 
      firstName : firstName === "" ? this.state.node.firstName : firstName,
      lastName : lastName === "" ? this.state.node.lastName : lastName,
    }
    console.log("editPerson", person);
    this.setState({
      editMode : false
    });
    Relay.Store.commitUpdate(
        new  EditPersonMutation({
          person,
          viewer : this.props.viewer
        })
      )
  }
  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
        <h1>people</h1>
        <ul>
          {this.props.viewer.people.edges.map(edge =>
            <li key={edge.node.id}>
              First name : {edge.node.firstName}. 
              Last name : {edge.node.lastName}
              &nbsp;<button onClick={()=>{this.deletePerson(edge.node.id)}}>Delete</button>
              &nbsp;<button onClick={()=>{this.editMode(edge.node)}}>Edit</button>
            </li>
          )}
        </ul>
        <h4>Add Person</h4>
        <form onSubmit={this.addPerson}>
          <input type="text" name="firstName" ref="firstName"/>
          <input type="text" name="lastName" ref="lastName" />
          <input type="submit" />
        </form>
        {
          this.state.editMode ? 
          <div>
            <h4>Edit person</h4>
            <form onSubmit={this.editPerson}>
              <input type="text" name="firstName" ref="editFirstName" placeholder={this.state.node.firstName} />
              <input type="text" name="lastName" ref="editLastName" placeholder={this.state.node.lastName} />
              <input type="submit" />
            </form> 
          </div>
          : ""

        }
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
        people (first : 10) {
          edges {
            node {
              id
              firstName
              lastName
            }
          }
        }
        ${DeletePersonMutation.getFragment('viewer')}
        ${AddPersonMutation.getFragment('viewer')}
        ${EditPersonMutation.getFragment('viewer')}
      }

    `,
  },
});
