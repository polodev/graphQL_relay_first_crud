/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
class User {}
class Widget {}
class People {}

var peopleName = [
  {
    firstName : "vasanth",
    lastName : "sai"
  },
  {
    firstName : "ranjith",
    lastName : "nori"
  },
  {
    firstName : "polo",
    lastName : "dev"
  }
]

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});

var people = peopleName.map((personName, index) => {
  let person = new People();
  person.firstName = personName.firstName,
  person.lastName = personName.lastName,
  person.id = `${index}`
  return person
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getWidget: (id) => widgets.find(w => w.id === id),
  getWidgets: () => widgets,
  getPerson: (id) => people.find(w => w.id === id),
  getPeople: () => people,
  deletePerson: (id) => {
    var person = people.filter(person => person.id === id)[0];
    var personIndex = people.indexOf(person);
    people.splice(personIndex, 1);
    return id;
  },
  addPerson : (firstName, lastName) => {
    var person = new People();
    person.firstName = firstName;
    person.lastName = lastName;
    person.id = `${people.length}`;
    people.push(person);
    return person.id
  },
  editPerson : (id, firstName, lastName) => {
    var person = people.filter(person => person.id === id)[0]
    if(person) {
      person.firstName = firstName;
      person.lastName = lastName
    }
  },
  User,
  Widget,
  People
};
