import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import settings from '/settings.json'

import App from '../imports/ui/App.jsx'

const client = new ApolloClient({
  link: new HttpLink({ uri: settings.graphqlUrl }),
  cache: new InMemoryCache(),
})

// client.query({ query: gql`{ allUsers { id, name, username, email } }` }).then(console.log);

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('render-target')
  )
})
