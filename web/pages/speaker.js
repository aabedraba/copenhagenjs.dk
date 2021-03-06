import React from 'react'
import 'isomorphic-unfetch'
import Head from 'next/head'
import { gql } from 'apollo-boost'
import { client } from '../services/graphql.js'
import { ApolloProvider } from '@apollo/react-hooks'
import { useQuery } from '@apollo/react-hooks'
import Page from '../components/Page'
import { Embed } from '../components/YoutubeEmbed'
import { SpeakerProfile } from '../components/SpeakerProfile.js'

export function getParams() {
  return new URLSearchParams(
    typeof window == 'object' ? window.location.search : ''
  )
}

function Speakers() {
  const slug = getParams().get('name')
  const { loading, error, data } = useQuery(gql`
    query {
      speakerProfile(slug: "${slug}") {
        ...SpeakerProfileDetails
      }
    }
    ${SpeakerProfile.fragment}
  `)

  if (loading) return <span>Loading...</span>
  if (error) return <span>Error :(</span>

  if (!data.speakerProfile) return <span>No data yet!</span>

  const user = data.speakerProfile.ghostUser || data.speakerProfile.user
  return (
    <div>
      <Head>
        <title>{data.speakerProfile.name} spoke at CopenhagenJS</title>
        <link
          rel="canonical"
          href={`https://copenhagenjs.dk/speaker/?name=${data.speakerProfile.slug}`}
        />
      </Head>
      <SpeakerProfile.tag
        name={data.speakerProfile.name}
        presentations={data.speakerProfile.presentations}
        user={user}
        videos={data.speakerProfile.videos}
      />
    </div>
  )
}

export default () => (
  <ApolloProvider client={client}>
    <Page>
      <Speakers />
    </Page>
  </ApolloProvider>
)
