import React, { PureComponent } from "react";
import { TextField, Button, Stack, StackItem, Card, CardBody } from "nr1";

import { client } from "../graphql/ApolloClientInstance";
import { ACCESS_CHECK_QUERY } from "../graphql/Queries";

export default class Auth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      githubAccessError: null
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    this.checkGithubAccess();
  };

  /**
   * Checks that the submitted token is able to connect to the GitHub GraphQL
   * API using a simple query to pull back the login username
   */
  checkGithubAccess() {
    // Call GitHub GraphQL API to check if this token has access
    client(this.state.userToken)
      .query({
        query: ACCESS_CHECK_QUERY
      })
      .then(result => {
        console.log(result);
        this.props.setUserToken(this.state.userToken);
      })
      .catch(err => {
        console.error(err);
        this.setState({ githubAccessError: err });
      });
  }

  /**
   * Renders the login view to accept the user's token and store it in NerdStorage
   * Partially borrowed from: https://github.com/newrelic/nr1-github/blob/master/nerdlets/github-about/setup.js#L13
   */
  render() {
    const { userToken, githubAccessError } = this.state || {};
    const { setUserToken } = this.props;
    const GHURL = "https://github.com";

    return (
      <StackItem>
        <Card style={{ width: "600px" }}>
          <CardBody>
            <StackItem>
              <h1>GitHub Repository Explorer Login</h1>
              <p>
                This integration allows the user to browse information about their GitHub
                repositories.
              </p>
            </StackItem>
            <StackItem className="mt-2">
              <h3>Authenticate via Personal Access Token</h3>
              <p>
                To get started,{" "}
                <a href={`${GHURL}/settings/tokens`} target="_blank" rel="noopener noreferrer">
                  generate a personal access token
                </a>{" "}
                for your GitHub account. You will need to grant <code>repo</code> scopes to view
                private repository data.
              </p>
              <form onSubmit={this.handleSubmit}>
                {githubAccessError && (
                  <p style={{ color: "red" }}>
                    Error: Failed to authenticate with the given token - please{" "}
                    <a href={`${GHURL}/settings/tokens`} target="_blank" rel="noopener noreferrer">
                      check access
                    </a>{" "}
                    and try again.
                  </p>
                )}
                <Stack fullWidth verticalType={Stack.VERTICAL_TYPE.BOTTOM} className="mt-1">
                  <StackItem grow>
                    <TextField
                      autofocus
                      label="GitHub Token"
                      placeholder="Paste your user token here"
                      onChange={({ target }) => {
                        this.setState({ userToken: target.value });
                      }}
                    />
                  </StackItem>
                  <StackItem>
                    <Button disabled={!userToken || userToken.length !== 40} type="primary">
                      Set Your GitHub Token
                    </Button>
                  </StackItem>
                </Stack>
              </form>
            </StackItem>
          </CardBody>
        </Card>
      </StackItem>
    );
  }
}
