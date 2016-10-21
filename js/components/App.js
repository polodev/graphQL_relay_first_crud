import React from 'react';
import Relay from 'react-relay';
import DeletePersonMutation from '../mutation/DeletePersonMutation.js'

class App extends React.Component {
  deletePerson = (id) => {
    let person = {
      id
    }
    Relay.Store.commitUpdate(
        new DeletePersonMutation({person, viewer : this.props.viewer})
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
              <button onClick={()=>{this.deletePerson(edge.node.id)}}>Delete</button>
            </li>
          )}
        </ul>
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
      }

    `,
  },
});
