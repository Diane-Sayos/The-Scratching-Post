import axios from "axios";
import history from "../history";

const users = (state = [], action) => {
  if (action.type === "SET_USERS") {
    return action.users;
  }
  if (action.type === "CREATE_USER") {
    return [action.user, ...state];
  }
  if (action.type === "UPDATE_USERS") {
    return state.map((user) =>
      user.id === action.user.id ? action.user : user
    );
  }
  if (action.type === "DELETE_USER") {
    return state.filter((user) => user.id !== action.id);
  }
  return state;
};

export const createUser = (credentials) => {
  return async (dispatch) => {
    try {
      let user = (await axios.post("/api/users", credentials)).data;
      dispatch({ type: "CREATE_USER", user });
    } catch (error) {
      if (error.response.data === "Cannot add duplicate email") {
        alert("Cannot add duplicate email");
      } else {
        console.log(error);
      }
    }
  };
};
export const setUsers = () => {
  return async (dispatch) => {
    const users = (
      await axios.get("/api/users", {
        headers: {
          authorization: window.localStorage.getItem("token"),
        },
      })
    ).data;
    dispatch({ type: "SET_USERS", users });
  };
};
export const updateUsers = (user) => {
  return async (dispatch) => {
    try {
      user = (
        await axios.put(`/api/users/${user.id}`, user, {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        })
      ).data;
      dispatch({ type: "UPDATE_USERS", user });
      history.push(`/profile/${user.id}`);
    } catch (ex) {
      console.log(ex);
    }
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    await axios.delete(`/api/users/${id}`);
    dispatch({ type: "DELETE_USER", id });
  };
};

export default users;
