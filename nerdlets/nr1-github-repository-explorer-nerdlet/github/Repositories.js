import React, { PureComponent } from "react";
import { HeadingText, TextField } from "nr1";

export default class Repositories extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewer: props.viewer,
      searchValue: null,
      filteredRepositories: props.viewer.repositories.nodes
    };
  }

  /**
   * Helper function for setting the filtered table content used
   * with the name search field
   */
  filterTable = event => {
    this.setState({
      searchValue: event.target.value,
      filteredRepositories: this.state.viewer.repositories.nodes.filter(curr => {
        return curr.name.includes(event.target.value);
      })
    });
  };

  render() {
    const { viewer, filteredRepositories } = this.state;

    return (
      <div>
        <HeadingText spacingType={[HeadingText.SPACING_TYPE.OMIT]}>
          Repository List for user: <strong style={{ color: "#038b99" }}>{viewer.login}</strong>
        </HeadingText>
        <TextField
          autofocus
          label="Name Search"
          placeholder="Type to filter repos by name"
          onChange={this.filterTable}
        />
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Created At</th>
                <th>Private?</th>
                <th>Last Commit</th>
                <th>Commit Comments Total Count</th>
                <th>Total Commit Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepositories.length > 0 ? (
                filteredRepositories.map((node, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <a href={node.url} target="_blank" rel="noopener noreferrer">
                          {node.name}
                        </a>
                      </td>
                      <td>{node.createdAt}</td>
                      <td>{node.isPrivate ? "Y" : "N"}</td>
                      <td>
                        <a
                          href={node.defaultBranchRef.target.commitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {node.defaultBranchRef.target.message}
                        </a>
                      </td>
                      <td>{node.commitComments.totalCount}</td>
                      <td>{node.defaultBranchRef.target.history.totalCount}</td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ backgroundColor: "fff" }}>
                  <td colSpan="6">No data to display</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
