import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

import App from '../imports/ui/App.jsx'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cj7d9utpn0xk90108wgqj1ym9' }),
  cache: new InMemoryCache(),
})

client.query({ query: gql`{ Message(id: "cj8j2w9o45c1x0100w43djd80" ) { createdAt, text } }` }).then(console.log);

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('render-target')
  )
})
