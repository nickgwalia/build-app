import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Accounts } from 'meteor/accounts-base'

// import Loading from './Loading'
import LoginForm from './LoginForm'

const ApolloTest = ({ currentUser, refetch, userLoading, userCount }) => {
  // console.log("currentUser", currentUser)
  console.log('userCount: ', userCount)
  return (
    <div className="ApolloTest">

      <div className="ApolloTest-block">
        {userLoading
          ? <Loading />
          : <div className="ApolloTest-content">

              {currentUser
                ? <div>
                    <pre>{JSON.stringify(currentUser, null, 2)}</pre>
                    <button onClick={() => refetch()}>Refetch the query!</button>
                  </div>
                : 'Please log in!'}
            </div>}
      </div>

    </div>
  )
}

ApolloTest.propTypes = {
  currentUser: PropTypes.object,
  hasErrors: PropTypes.bool,
  refetch: PropTypes.func,
  userLoading: PropTypes.bool,
}

/*
 * We use `gql` from graphql-tag to parse GraphQL query strings into the standard GraphQL AST
 * See for more information: https://github.com/apollographql/graphql-tag
 */
const GET_USER_DATA = gql`
  query getCurrentUser {
    user {
      emails {
        address
        verified
      }
      randomString
      _id
    }
  }
`
const GET_ALL_USERS = gql`
  query getAllUsers {
    allUsers {
      id
      name
      username
      email
    }
  }
`

/*
 * We use the `graphql` higher order component to send the graphql query to our server
 * See for more information: http://dev.apollodata.com/react/
 */
const withData = graphql(GET_ALL_USERS, {
  // destructure the default props to more explicit ones
  props: ({ data: { error, loading, allUsers, refetch } }) => {
    if (loading) return { userLoading: true, userCount: 0 }
    if (error) return { hasErrors: true }

    const user = allUsers[0]
    console.log("user:", user)

    return {
      currentUser: user,
      userCount: allUsers.length,
      refetch
    }
  },
})

const Loading = () => (
  <div className="Loading">
    <div className="Loading-bounce Loading-bounce--1" />
    <div className="Loading-bounce Loading-bounce--2" />
    <div className="Loading-bounce Loading-bounce--3" />
  </div>
)

export default withData(ApolloTest)
