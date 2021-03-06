import React, { useState, useEffect } from 'react'
import 'isomorphic-unfetch'
import { gql } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { useLazyQuery } from '@apollo/react-hooks'
import Page from '../components/Page'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import ApolloClient from 'apollo-boost'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import SettingsMenu from '../components/SettingsMenu'
import { ProfileEditForm } from '../components/ProfileEditForm'
import {
  initFirebase,
  firebaseLogin,
  logoutFirebase,
  redirectToLogin
} from '../services/firebase.js'
import { UserEventFeed } from '../components/UserEventFeed'

const client = new ApolloClient({
  uri: 'https://graphql.copenhagenjs.dk/graphql'
})

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: ProfileInput!) {
    updateProfile(input: $input) {
      name
      githubId
    }
  }
`

let token = ''

const Profile = () => {
  const [loaded, setLoaded] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [getProfile, { called, loading, error, data }] = useLazyQuery(
    gql`
      query {
        me {
          name
          email
          username
          image
          githubId
          twitterId
          instagramId
          website
          favorites
          events {
            ...UserEventFeed
          }
        }
      }
      ${UserEventFeed.fragment}
    `,
    {
      context: {
        headers: {
          authorization: 'bearer ' + token
        }
      },
      onCompleted(data) {
        if (error) return false
        if (!loaded && data && data.me) {
          setLoaded(true)
          setProfileData({ ...data.me })
        }
      }
    }
  )

  useEffect(() => {
    firebaseLogin()
      .then(newToken => {
        token = newToken
        getProfile()
      })
      .catch(e => {
        console.log('It is okay', e)
        if (e.message === 'no user') {
          redirectToLogin()
        }
      })
  }, [])

  const [
    updateProfile,
    { data: updateProfileData, loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_PROFILE, {
    context: {
      headers: {
        authorization: 'bearer ' + token
      }
    }
  })

  if (loading) return <span>Loading...</span>

  const onSubmit = ({
    name,
    username,
    image,
    githubId,
    twitterId,
    instagramId,
    website,
    favorites
  }) => {
    updateProfile({
      variables: {
        input: {
          name,
          username,
          image,
          githubId,
          twitterId,
          instagramId,
          website,
          favorites
        }
      }
    })
  }
  const defaultValues = {
    name: profileData.name || '',
    username: profileData.username || '',
    image: profileData.image || '',
    githubId: profileData.githubId || '',
    twitterId: profileData.twitterId || '',
    instagramId: profileData.instagramId || '',
    website: profileData.website || '',
    favorites: profileData.favorites || []
  }
  return (
    <>
      <h1>Events attending</h1>
      <UserEventFeed.tag events={profileData.events || []} />
      <h1>Public Profile</h1>
      <div>
        <label>Email:</label>
      </div>
      <div>{profileData.email}</div>
      <ProfileEditForm defaultValues={defaultValues} onSubmit={onSubmit} />
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Look in the console and report it!</p>}
      {updateProfileData && <p>✅ Updated succesful!</p>}
    </>
  )
}

export default () => {
  return (
    <Page>
      <ApolloProvider client={client}>
        <SettingsMenu clickLogout={logoutFirebase} />
        <Profile />
      </ApolloProvider>
    </Page>
  )
}
