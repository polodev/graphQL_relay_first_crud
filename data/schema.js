/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Widget,
  People,
  getUser,
  getViewer,
  getWidget,
  getWidgets,
  getPerson,
  getPeople,
  deletePerson,
  addPerson
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Widget') {
      return getWidget(id);
    } else if (type === 'Person') {
      return getPerson(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Widget)  {
      return widgetType;
    } else if(obj instanceof People) {
      return personType;
    }
    else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    widgets: {
      type: widgetConnection,
      description: 'A person\'s collection of widgets',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getWidgets(), args),
    },
    people : {
      type: personConnection,
      description: 'people details',
      args: connectionArgs,
      resolve: (_, args) => connectionFromArray(getPeople(), args),
    },
  }),
  interfaces: [nodeInterface],
});

var widgetType = new GraphQLObjectType({
  name: 'Widget',
  description: 'A shiny widget',
  fields: () => ({
    id: globalIdField('Widget'),
    name: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});


/**
 * Define your own connection types here
 */
var {connectionType: widgetConnection} =
  connectionDefinitions({name: 'Widget', nodeType: widgetType});


var personType = new GraphQLObjectType({
  name: 'Person',
  description: 'A representation of person',
  fields: () => ({
    id: globalIdField('Person'),
    firstName: {
      type: GraphQLString,
      description: 'The name of the widget',
    },
    lastName : {
      type: GraphQLString,
      description: 'The name of the widget',
    },
  }),
  interfaces: [nodeInterface],
});

var {connectionType: personConnection, edgeType : personEdge} =
  connectionDefinitions({name: 'Person', nodeType: personType});
/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

//GraphQLMutation
const DeletePersonMutation = mutationWithClientMutationId({
  name : 'DeletePerson',
  inputFields : {
    id : {type : GraphQLString }
  },
  outputFields : {
    deletedPersonId : {
      type : GraphQLID,
      resolve : ({id}) => id,
    },
    viewer : {
      type : userType,
      resolve : () => getViewer()
    }
  },
  mutateAndGetPayload : (inputFields) => {
    console.log("mutateAndGetPayload", inputFields);
    let {id} = inputFields;
    let localId = fromGlobalId(id).id;
    deletePerson(localId);
    return inputFields
  }
})

const AddPersonMutation = mutationWithClientMutationId({
  name : "AddPerson",
  inputFields : {
    firstName : {type : GraphQLString},
    lastName : {type : GraphQLString}
  } ,
  outputFields : {
    personEdge :{
      type : personEdge,
      resolve : ({localPersonId}) => {
        const person = getPerson(localPersonId);
        return {
          node : person,
          cursor : cursorForObjectInConnection(getPeople(), person)
        }
      }
    },
    viewer : {
      type : userType,
      resolve : () => getViewer()
    }
  },
  mutateAndGetPayload :({firstName, lastName}) => {
    const localPersonId = addPerson(firstName, lastName);
    return {localPersonId}
  }
})



/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
    deletePerson : DeletePersonMutation,
    addPerson : AddPersonMutation,
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
   mutation: mutationType
});
