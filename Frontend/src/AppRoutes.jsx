import {BrowserRouter, Route, Routes} from 'react-router'
import LoginForm from './features/auth/pages/LoginForm'
import RegistrationForm from './features/auth/pages/RegistrationForm'
import Feed from './features/posts/pages/Feed'
import CreatePost from './features/posts/pages/CreatePost'
import Nav from './features/shared/components/Nav'
import Profile from './features/shared/components/Profile'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path='/' element={<LoginForm/>} />
                <Route path='register' element={<RegistrationForm/>} />
                <Route path='/feed' element={<Feed/>} />
                <Route path='/createpost' element={<CreatePost/>} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes