//solely to create a post and add photosforpost component as helper compoent

import React from "react";
import { connect } from "react-redux";
import { addPhoto, createPost, getSinglePost } from "../store";
import { withRouter } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import styled from "styled-components";
import { io } from "socket.io-client";

export const Form = styled.form``;
export const Caption = styled.textarea`
  width: 90%;
  height: 200px;
  background-color: #3fa796;
  color: #f5c7a9;
  border: 2px solid #f5c7a9;
  outline: none;

  ::placeholder {
    color: #f5c7a9;
  }
`;

export const Photos = styled.input`
  display: none;
`;
export const PhotoList = styled.ul`
  display: flex;
  list-style-type: none;
  flex-wrap: wrap;
  margin-right: auto;
  margin-left: auto;
`;
export const Button = styled.button`
  padding: 15px;
  width: 90%;
  border: 1px solid #f5c7a9;
  cursor: pointer;
  background-color: #3fa796;
  color: #f5c7a9;
`;

export const Image = styled.img`
  height: 60px;
  width: 60px;
  border-radius: 12px;
  margin-right: 2px;
`;
export const Label = styled.label`
  display: flex;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
`;

export const UploadedPhotos = styled.li`
  position: relative;
`;

let socket;

class PostCreateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      body: "",
      photos: [],
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangePhoto = this.onChangePhoto.bind(this);
  }

  componentDidMount() {
    socket = io();
  }

  componentWillUnmount() {
    setTimeout(() => {
      socket.emit("forceDisconnect");
    }, 1000);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangePhoto = (e) => {
    console.log(e.target.files);
    const photo = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setState({ photos: [...this.state.photos, reader.result] });
    });
    reader.readAsDataURL(photo);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { photos, body } = this.state;
    this.props.createPostWithImages(photos, body, this.props.auth);
    this.setState({ photos: [], body: "" });
    this.props.history.push("/");
  };

  render() {
    const { body, photos } = this.state;
    const { onChange, onChangePhoto, handleSubmit } = this;
    return (
      <Form onSubmit={handleSubmit}>
        <Caption
          placeholder="Whats on your mind? ..."
          type="text"
          name="body"
          value={body}
          onChange={onChange}
          required
        />
        <Photos id="file" type="file" multiple onChange={onChangePhoto} />
        <Label htmlFor="file">
          <AddAPhotoIcon style={{ cursor: "pointer", color: "#f5c7a9" }} />
        </Label>
        <PhotoList>
          {photos.map((photo) => {
            return (
              <UploadedPhotos key={photo}>
                <Image src={photo ? photo : null} />
              </UploadedPhotos>
            );
          })}
        </PhotoList>
        <Button disabled={photos.length === 0}>Submit</Button>
      </Form>
    );
  }
}

const mapState = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    createPostWithImages: async (photos, body, auth) => {
      const post = await dispatch(createPost(body, auth));
      for (let i = 0; i < photos.length; i++) {
        if (i !== photos.length - 1) {
          await dispatch(addPhoto(photos[i], post, auth));
        } else {
          await dispatch(addPhoto(photos[i], post, auth));
          await dispatch(getSinglePost(post));
        }
      }
      socket.emit("createPost", auth.id);
    },
  };
};

export default withRouter(connect(mapState, mapDispatch)(PostCreateForm));
