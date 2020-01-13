import React from "react";
import {
  UserStorageQuery,
  UserStorageMutation,
  Toast,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Spinner,
  Tabs,
  TabsItem
} from "nr1";

import Auth from "./auth/Auth";
import GitHubQuery from "./github/GitHubQuery";
import Status from "./constants/Status";
import Settings from "./auth/Settings";

export default class Nr1GitHubRepositoryExplorerNerdlet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: Status.LOADING //default state of page is loading as we try to retrive the user's token
    };
  }

  /**
   * Stores userToken to NerdStorage and refreshes status of page.
   * Borrowed from: https://github.com/newrelic/nr1-github/blob/master/nerdlets/github-about/main.js#L90
   */
  _setUserToken = userToken => {
    const mutation = {
      actionType: UserStorageMutation.ACTION_TYPE.WRITE_DOCUMENT,
      collection: "global",
      documentId: "userToken",
      document: { userToken }
    };

    UserStorageMutation.mutate(mutation);
    this.setState({
      userToken,
      status: userToken ? Status.USER_TOKEN_SET : Status.USER_TOKEN_EMPTY
    });
  };

  /**
   * Loads the userToken from NerdStorage
   * Partially borrowed from: https://github.com/newrelic/nr1-workshop/blob/master/lab9/INSTRUCTIONS.md
   */
  _loadState() {
    UserStorageQuery.query({
      collection: "global",
      documentId: "userToken"
    })
      .then(({ data }) => {
        if (!data) {
          console.log("Cannot update state. No new entities returned from UserStorageQuery.");
          this.setState({ userToken: null, status: Status.USER_TOKEN_EMPTY });
        } else {
          console.debug(data);

          this.setState({
            userToken: data.userToken,
            status: data.userToken ? Status.USER_TOKEN_SET : Status.USER_TOKEN_EMPTY
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({ userToken: null, status: Status.USER_TOKEN_EMPTY });
        Toast.showToast({ title: error.message, type: Toast.TYPE.CRITICAL });
      });
  }

  componentDidMount() {
    this._loadState();
  }

  render() {
    const { userToken, status } = this.state;

    if (status === Status.LOADING) return <Spinner fillContainer />;

    return (
      <div className="root">
        <Grid>
          <GridItem columnSpan={12}>
            <Stack
              directionType={Stack.DIRECTION_TYPE.VERTICAL}
              horizontalType={Stack.HORIZONTAL_TYPE.CENTER}
              gapType={Stack.GAP_TYPE.EXTRA_LOOSE}
              fullWidth
            >
              {/* No user, render the login screen */}
              {status === Status.USER_TOKEN_EMPTY && <Auth setUserToken={this._setUserToken} />}

              {/* User exists, render tabs with repo content from GitHub GraphQL API */}
              {status === Status.USER_TOKEN_SET && (
                <StackItem className="content-wrapper">
                  <Tabs defaultValue="tab-1" className="tabs">
                    <TabsItem value="tab-1" label="Repositories">
                      <GitHubQuery userToken={userToken} />
                    </TabsItem>
                    <TabsItem value="tab-2" label="Settings">
                      <Settings setUserToken={this._setUserToken} />
                    </TabsItem>
                  </Tabs>
                </StackItem>
              )}
            </Stack>
          </GridItem>
        </Grid>
      </div>
    );
  }
}
