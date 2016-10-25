GraphQLBoolean
GraphQLFloat
GraphQLID
GraphQLInt
GraphQLList
GraphQLNonNull
GraphQLObjectType
#a function which take a object as argument containing name, description, fields, interfaces
GraphQLSchema
#a function which return a schema. it takes object as argument containing mutation and query. where query is main/root query and mutation is root mutation
GraphQLString
#import from graphql

connectionArgs
#in field args if we define this connection args we can use  first last before after in query
connectionDefinitions
#its a function which will receive a object argument containing name and nodeType properties and return connectionType and edgeType
connectionFromArray
fromGlobalId
#its a function which will return a object containing type and id. here id is localId, and type is passed argument to globalIdField function
globalIdField
#its a function which will make unique id. 
mutationWithClientMutationId
#its a function which receive a object argument containing name, inputFields, outputFields, mutateAndGetPayload
nodeDefinitions
#its a function which return a object containing nodeInterface and nodeField
cursorForObjectInConnection
#import from graphql-relay


nodeInterface, nodeField 
#return from nodeDefinitions
fields 
#its a function which containing all the field of the database. every field is a object containing name, description, args, resolve method
connectionType
#property of return object from connectionDefinitions
edgeType
#property of return object from connectionDefinitions
inputFields 
#its a propery of passing object in  mutationWithClientMutationId function. it describe field which need to be mutate
outputFields 
#its a propery of passing object in  mutationWithClientMutationId function. it describe output fields which have effect after mutation
mutateAndGetPayload
#a function actully do mutate. inputFields as argument and return is argument of  outputFields resolve method

Mutation
# Relay.Mutation extends by all mutation class. which will implement 4 method and one optional method and one static fragments propery
getMutation
#a function where graphql mutation is defined
getVariables
#a function which will determine which inputFields need to mutation
getConfigs
#a function which return a array containing object of configuration. configuration contain type ['FIELDS_CHANGE', 'RANGE_ADD', 'NODE_DELETE']
getOptimisticResponse
#for week network connection it is important to update content when user mutate something
getFatQuery
#function return Relay.QL to update after mutation
FIELDS_CHANGE
#getConfigs type to edit field
RANGE_ADD
#getConfigs type to add new edge/node
NODE_DELETE
#getConfigs type to delete a node
parentName
#a getConfigs return object propery. which usally main Viewer/Store/User
parentID 
#
connectionName
#a getConfigs return object propery. which define in main userType/viewer. 
edgeName
#a getConfigs return object propery. which getting from connectionDefinitions in schema
rangeBehaviors 
#a getConfigs return object metho. which return whether added value is append or prepend 
QL  
#Relay.QL is function which arguments in GraphQL Query language



 

























