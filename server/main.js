import { Meteor } from 'meteor/meteor'
import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from '/imports/api/schema'
import '../imports/api/users'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

createApolloServer({
  schema
})
