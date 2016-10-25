import Relay from 'react-relay';

class EditPersonMutation extends Relay.Mutation {
	static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        people(first: 20){
          edges{
            node{
              id,
              firstName,
              lastName
            }
          }
        },
      }
    `,
  }
	getMutation() {
		return Relay.QL `mutation { editPerson }`;
	}
	getVariables () {
		return {
			id : this.props.person.id,
			firstName : this.props.person.firstName,
			lastName : this.props.person.lastName
		}
	}
	getFatQuery () {
		return Relay.QL `
			fragment on EditPersonPayload @relay(pattern: true) {
				personEdge
				viewer
			}
		`
	}
	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
      fieldIDs: {
      	viewer : this.props.viewer.id
      },
		}]
	}
	getOptimisticResponse() {
		return {
			viewer : this.props.viewer.id
			
		}
	}
}

export default EditPersonMutation;