import React from 'react'
import AppRoutes from './AppRoutes'
import "./Style.scss"
import { AuthProvider } from './features/auth/auth.context.jsx'
import { PostContextProvider } from './features/posts/post.context.jsx'

const App = () => {
  return (
    <AuthProvider>
      <PostContextProvider>
        <AppRoutes/>
      </PostContextProvider>
    </AuthProvider>
  )
}

export default App