import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Box, Typography } from "@mui/material";
import styled from "styled-components";

export const SearchDiv = styled.div``;

export const SearchResultDiv = styled.div`
  background-color: #3fa796;
  text-align: center;
  text-transform: capitalize;
  border-radius: 4px;
`;

export const SearchResults = styled.div`
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  padding: 5px;
  width: 250px;
  border-radius: 8px;
  border: none;
  border: 2px solid #f5c7a9;

  ::placeholder {
    color: #3fa796;
  }
`;

const Search = ({ users }) => {
  const [filteredData, setFilteredData] = useState("");
  return (
    <Box>
      <SearchDiv>
        <Input
          type="text"
          placeholder="Search User ..."
          onChange={(event) => setFilteredData(event.target.value)}
        />
      </SearchDiv>
      {filteredData.length != 0 && (
        <SearchResultDiv>
          {users
            .filter((user) =>
              user.username.toLowerCase().includes(filteredData)
            )
            .map((user) => {
              return (
                <Link
                  key={user.id}
                  style={{ color: "#F5C7A9" }}
                  to={`/profile/${user.id}`}
                >
                  <SearchResults>
                    <Avatar
                      sx={{
                        height: "30px",
                        width: "30px",
                        margin: 2,
                        border: "1px solid #F5C7A9",
                      }}
                      src={user.avatar}
                    />
                    <Typography>{user.username}</Typography>
                  </SearchResults>
                </Link>
              );
            })}
        </SearchResultDiv>
      )}
    </Box>
  );
};

const mapState = ({ users }) => {
  console.log("users", users);
  return {
    users,
  };
};

export default connect(mapState)(Search);
