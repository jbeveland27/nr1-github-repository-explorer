import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "nr1";

import { ApolloProvider } from "react-apollo";

import Repositories from "./Repositories";
import ErrorMessage from "../graphql/ErrorMessage";
import { client } from "../graphql/ApolloClientInstance";
import { GET_REPOS_QUERY } from "../graphql/Queries";

export default class GitHubQuery extends React.Component {
  render() {
    const { userToken } = this.props;

    const apClient = client(userToken);

    return (
      <ApolloProvider client={apClient}>
        <Query pollInterval={60 * 1000} query={GET_REPOS_QUERY}>
          {({ data, loading, error }) => {
            if (error) {
              return <ErrorMessage error={error} />;
            }

            const { viewer } = data;

            if (loading || !viewer) {
              return <Spinner fillContainer type={Spinner.TYPE.DOT} />;
            }

            console.debug(viewer);

            return <Repositories viewer={viewer} />;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}
