import Relay from 'react-relay';

class DeletePersonMutation extends Relay.Mutation {
	static fragments = {
		viewer : () => Relay.QL `
			fragment on User {
				id, 
				people(first : 20) {
					edges {
						node {
							id
						}
					}
				}
			}
		`
	}
	getMutation() {
		return Relay.QL `mutation { deletePerson }`;
	}
	getVariables () {
		return {
			id : this.props.person.id
		}
	}
	getFatQuery () {
		return Relay.QL `
			fragment on DeletePersonPayload @relay(pattern: true) {
				deletedPersonId
				viewer
			}
		`
	}
	getConfigs() {
		return [{
			type : 'NODE_DELETE',
			parentName : 'viewer',
			parentID : this.props.viewer.id,
			connectionName : 'people',
			deletedIDFieldName : 'deletedPersonId'
		}]
	}
	getOptimisticResponse() {
		return {
			deletedPersonId : this.props.person.id ,
			viewer : {id : this.props.person.id}
		}
	}
}

export default DeletePersonMutation;