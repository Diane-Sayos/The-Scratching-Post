import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory, withRouter, Redirect } from "react-router-dom";
import { addComment } from "../store";
import styled from "styled-components";

export const Form = styled.form``;

export const Caption = styled.textarea`
  width: 90%;
  height: 200px;
  background-color: #3fa796;
  border: 2px solid #f5c7a9;
  color: #f5c7a9;
  outline: none;

  ::placeholder {
    color: #f5c7a9;
  }
`;
export const Button = styled.button`
  padding: 15px;
  width: 90.5%;
  border: 1px solid #f5c7a9;
  cursor: pointer;
  background-color: #3fa796;
  color: #f5c7a9;
  margin-top: 15px;
`;

const CommentHelper = ({ authId, postId, addComment, socket }) => {
  const path = `/posts/${postId}`;
  console.log("path", path);
  console.log("postId", postId);
  const [body, setBody] = useState("");
  const history = useHistory();
  console.log("history", history);

  const onChange = (e) => {
    setBody(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addComment(body, postId, authId, socket);
    setBody("");
    setTimeout(() => {
      history.push(path);
    }, 1000);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Caption
        placeholder="Comment ..."
        value={body}
        onChange={onChange}
        required
      />
      <Button disabled={!body}>Post</Button>
    </Form>
  );
};
const mapDispatch = (dispatch) => {
  return {
    addComment: async (comment, postId, authId, socket) => {
      await dispatch(addComment(comment, postId, authId));
      await socket.emit("createPost");
    },
  };
};
export default connect(null, mapDispatch)(CommentHelper);
