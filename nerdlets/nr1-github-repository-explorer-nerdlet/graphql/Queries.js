import gql from "graphql-tag";

/**
 * Common place to hold various GraphQL queries
 */

export const GET_REPOS_QUERY = gql`
  {
    viewer {
      login
      repositories(last: 100) {
        totalCount
        nodes {
          name
          createdAt
          commitComments(last: 1) {
            totalCount
          }
          url
          isPrivate
          defaultBranchRef {
            target {
              ... on Commit {
                id
                message
                messageBody
                history {
                  totalCount
                }
                commitUrl
              }
            }
          }
        }
      }
    }
  }
`;

export const ORIGINAL_GET_REPOS_QUERY = gql`
  {
    viewer {
      repositories(last: 100) {
        totalCount
        nodes {
          name
          createdAt
          commitComments(last: 1) {
            totalCount
          }
        }
      }
    }
  }
`;

export const ACCESS_CHECK_QUERY = gql`
  query {
    viewer {
      login
    }
  }
`;
