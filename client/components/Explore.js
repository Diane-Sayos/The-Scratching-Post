import React from "react";
import { connect } from "react-redux";
import PostHelper from "./PostHelper";

const Explore = ({posts, auth, photos}) => {
  return (
    <PostHelper posts={posts} auth={auth} photos={photos}/>
  )
};
const mapState = state => {
  const posts = state.posts.filter(post => post.user.isPrivate === false) || [];
  const auth = state.auth || {};
  return {
    posts,
    auth,
    photos: state.photos
  }
};
export default connect(mapState)(Explore);