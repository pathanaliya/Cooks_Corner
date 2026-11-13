import React from 'react'
import backendContext from './backendContext'

export const BackendState = (props) => {

    // const host = 'https://culinashare-backend-63us2mxmg-niknshindes-projects.vercel.app';
    const host = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

  return (
    <backendContext.Provider
    value={{
      host
      
    }}
  >
    {props.children}
  </backendContext.Provider>  )
}

