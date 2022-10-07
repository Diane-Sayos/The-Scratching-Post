//to edit a post
//should be able to remove certain photos in the current post

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  Button,
  Caption,
  Form,
  Image,
  Label,
  PhotoList,
  Photos,
  UploadedPhotos,
} from "./PostCreateForm";
import { addPhoto, deletePhoto, setPosts, updatePost } from "../store";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";
import { Box } from "@mui/material";
import { io } from "socket.io-client";

export const PhotoDeleteWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #3fa796;
  fontweight: 900;
  opacity: 0;
`;

export const Container = styled.div`
  &: hover ${PhotoDeleteWrapper} {
    opacity: 1;
  }
`;

let socket;

const PostUpdateForm = ({ post, auth, updatePostWithImages }) => {
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState([]);

  const history = useHistory();

  useEffect(() => {
    socket = io();

    return () => {
      setTimeout(() => {
        socket.emit("forceDisconnect");
      }, 3000);
    };
  }, []);

  useEffect(() => {
    setBody(post.body);
    setPhotos(post.photos.map((photo) => photo.photoUrl));
  }, [post]);

  const onChangePhoto = (e) => {
    console.log(e.target.files);
    const photo = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setPhotos([...photos, reader.result]);
    });
    reader.readAsDataURL(photo);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updatePostWithImages(post, photos, body, auth);
    setBody("");
    setPhotos([]);
    history.push("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Caption
        type="text"
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <Photos id="file" type="file" multiple onChange={onChangePhoto} />
      <Label htmlFor="file">
        <AddAPhotoIcon
          style={{ cursor: "pointer", color: "#F5C7A9", fontWeight: 900 }}
        />
      </Label>
      <PhotoList>
        {photos.map((photo, index) => {
          return (
            <Container key={photo.id}>
              <UploadedPhotos key={index}>
                <Image
                  sx={{
                    height: "80px",
                    width: "80px",
                    marginRight: "2px",
                  }}
                  src={photo ? photo : null}
                />
                <PhotoDeleteWrapper
                  onClick={() => {
                    photos.splice(index, 1);
                    setPhotos([...photos]);
                  }}
                >
                  <DeleteIcon sx={{ height: "30px", width: "30px" }} />
                </PhotoDeleteWrapper>
              </UploadedPhotos>
            </Container>
          );
        })}
      </PhotoList>
      <Button style={{ fontWeight: 900 }} disabled={photos.length === 0}>
        Update
      </Button>
    </Form>
  );
};

const mapState = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    updatePostWithImages: async (originalPost, photos, body, auth) => {
      const post = await dispatch(updatePost(originalPost.id, body));
      for (let i = 0; i < originalPost.photos.length; i++) {
        await dispatch(deletePhoto(originalPost.photos[i]));
      }
      for (let i = 0; i < photos.length; i++) {
        if (i !== photos.length - 1) {
          await dispatch(addPhoto(photos[i], post, auth));
        } else {
          await dispatch(addPhoto(photos[i], post, auth));
        }
      }
      await dispatch(setPosts());
      socket.emit("createPost", auth.id);
    },
  };
};

export default connect(mapState, mapDispatch)(PostUpdateForm);
