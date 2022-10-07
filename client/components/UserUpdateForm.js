//be able to update user info

import React from "react";
import { connect } from "react-redux";
import { updateUsers } from "../store";
import { io } from "socket.io-client";
import { withRouter } from "react-router-dom";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import styled from "styled-components";

export const Form = styled.form`
  overflow: auto;
`;

export const UploadDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.span`
  font-weight: 900;
  margin-bottom: 10px;
  color: #f5c7a9;
`;

export const Input = styled.input`
  border-radius: 8px;
  height: 20px;
  margin-bottom: 30px;
  width: 50%;
  border: 2px solid #f5c7a9;
  color: #f5c7a9;
  background-color: #3fa796;
  font-weight: 900;
`;

export const Bio = styled.textarea`
  width: 50%;
  border: 2px solid #f5c7a9;
  font-weight: 900;
  color: #f5c7a9;
  background-color: #3fa796;
  height: 100px;
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
  border-radius: 12px;
  border: 2px solid #f5c7a9;
  cursor: pointer;
  background-color: #3fa796;
  color: #f5c7a9;
  margin-bottom: 20px;
  margin-top: 20px;
  font-weight: 900;
`;

export const Image = styled.img`
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin-left: 20px;
  border: 2px solid #f5c7a9;
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

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BioDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Select = styled.select`
  border-radius: 12px;
  width: 15%;
  text-align: center;
  color: #f5c7a9;
  background-color: #3fa796;
  border: 2px solid #f5c7a9;
`;

export const Option = styled.option`
  color: #f5c7a9;
`;

let socket;

class UserUpdateForm extends React.Component {
  constructor() {
    super();
    this.state = {
      id: "",
      username: "",
      email: "",
      avatar: "",
      bio: "",
      isPrivate: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangePhoto = this.onChangePhoto.bind(this);
  }
  componentDidMount() {
    socket = io();
    if (this.props.auth.isPrivate === false) {
      this.setState({
        id: this.props.auth.id,
        email: this.props.auth.email,
        avatar: this.props.auth.avatar,
        username: this.props.auth.username,
        bio: this.props.auth.bio,
        isPrivate: 1,
      });
    } else {
      this.setState({
        id: this.props.auth.id,
        email: this.props.auth.email,
        avatar: this.props.auth.avatar,
        username: this.props.auth.username,
        bio: this.props.auth.bio,
        isPrivate: 2,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.auth.id && this.props.auth.id) {
      if (this.props.auth.isPrivate === false) {
        this.setState({
          id: this.props.auth.id,
          email: this.props.auth.email,
          avatar: this.props.auth.avatar,
          username: this.props.auth.username,
          bio: this.props.auth.bio,
          isPrivate: 1,
        });
      } else {
        this.setState({
          id: this.props.auth.id,
          email: this.props.auth.email,
          avatar: this.props.auth.avatar,
          username: this.props.auth.username,
          bio: this.props.auth.bio,
          isPrivate: 2,
        });
      }
    }
    if (prevProps.auth.id && !this.props.auth.id) {
      this.state = {
        id: "",
        username: "",
        email: "",
        avatar: "",
        bio: "",
        isPrivate: 0,
      };
    }
  }
  componentWillUnmount() {
    socket.emit("forceDisconnect");
  }

  handleChange(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }
  onChangePhoto = (e) => {
    console.log(e.target.files);
    const photo = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.setState({ avatar: reader.result });
    });
    reader.readAsDataURL(photo);
  };
  handleSubmit(ev) {
    ev.preventDefault();
    const { isPrivate } = this.state;
    if (isPrivate === "1") {
      this.props.updateUsers({ ...this.state, isPrivate: false });
    } else {
      this.props.updateUsers({ ...this.state, isPrivate: true });
    }
    this.props.history.push(`/`);
  }
  render() {
    const { handleSubmit, handleChange, onChangePhoto } = this;
    const { avatar, username, bio, email, isPrivate } = this.state;
    return (
      <Form onSubmit={handleSubmit}>
        <Container>
          <UserInfo>
            <Title>Username</Title>
            <Input name="username" onChange={handleChange} value={username} />
            <Title>Email</Title>
            <Input name="email" onChange={handleChange} value={email} />
          </UserInfo>
          <BioDiv>
            <Title>User Bio</Title>
            <Bio name="bio" onChange={handleChange} value={bio} />
          </BioDiv>
        </Container>
        <UploadDiv>
          <Photos id="file" type="file" onChange={onChangePhoto} />
          <Label htmlFor="file">
            <AddAPhotoIcon style={{ cursor: "pointer", color: "#f5c7a9" }} />
          </Label>
          <Image src={avatar} />
        </UploadDiv>
        <Select value={isPrivate || 1} name="isPrivate" onChange={handleChange}>
          <Option value={1}>set to public</Option>
          <Option value={2}>set to private</Option>
        </Select>
        <Button>Submit Changes</Button>
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
    updateUsers: async (user) => {
      await dispatch(updateUsers(user));
      socket.emit("createUser");
    },
  };
};
export default withRouter(connect(mapState, mapDispatch)(UserUpdateForm));
