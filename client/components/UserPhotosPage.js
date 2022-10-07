//all images uploaded by user should show up here descending order from the latest one to the lowest one?

import React from 'react';
import { connect } from 'react-redux';

const UserPhotosPage = ({ user, photos, auth, connection}) => {
    return (
        <div>
           <h2>PHOTOS</h2>
            {
                auth.id === user.id?
                <div>
                {
                    photos.length ?
                    <ul>
                    {
                        photos.map(photo => {
                            return (
                                <li key={photo.id}><img src={photo.photoUrl} width='80' height='80' /></li>
                            )
                        })
                    }
                    </ul>: <p>No Photos Yet.</p>
                }
                </div> :
                <div>
                {
                    connection.id ?
                    <div>
                    {
                        connection.isAccepted ?
                        <ul>
                        {
                            photos.map(photo => {
                                return (
                                    <li key={photo.id}><img src={photo.photoUrl} width='80' height='80' /></li>
                                )
                            })
                        }
                        </ul> :
                        <div>
                            <p>Waiting on User Approval.</p>
                        </div>
                    }
                    </div> :
                    <div>
                        <p>User is Private.</p>
                    </div>
                }
                </div>
            }
        </div>
    )
};

const mapState = (state, { match }) => {
    const user = state.users.find(user => user.id === match.params.id) || {};
    const photos = state.photos.filter(photo => photo.userId === user.id) || [];
    const connection = state.connections.find(connection => connection.followerId === user.id && connection.followingId === state.auth.id) || {};
    return {
        user,
        photos,
        auth: state.auth,
        connection
    }
};

export default connect(mapState)(UserPhotosPage);