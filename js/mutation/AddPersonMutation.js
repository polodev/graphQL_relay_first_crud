import Relay from 'react-relay';

class AddPersonMutation extends Relay.Mutation {
	static fragments = {
		viewer : () => Relay.QL `
			fragment on User {
				id
			}
		`
	}
	getMutation () {
		console.log("getMutation", this.props);
		return Relay.QL `mutation {addPerson}`
	}
	getVariables () {
		console.log("getVariables", this.props);
		return {
			firstName : this.props.person.firstName,
			lastName : this.props.person.lastName
		}
	}
	getConfigs () {
		return [{
			type : 'RANGE_ADD',
			parentName : 'viewer',
			parentID : this.props.viewer.id,
			connectionName : 'people', //getting from userType
			edgeName : 'personEdge', //getting from connection definition 
			rangeBehaviors : () => {
				return 'append'
			}
		}]
	}
	getFatQuery () {
		return Relay.QL `
			fragment on AddPersonPayload @relay(pattern: true) {
				personEdge,
				viewer {
					people
				}
			}
		`
	}
	getOptimisticResponse () {
		return {
			personEdge : {
				node :  {
					firstName : this.props.person.firstName,
					lastName : this.props.person.lastName
				}
			},
			viewer : {
				id : this.props.viewer.id
			}
		}
	}

}

export default AddPersonMutation;