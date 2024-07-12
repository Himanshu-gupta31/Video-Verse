import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route,RouterProvider,createBrowserRouter,createRoutesFromElements } from 'react-router-dom'
import Signup from './Pages/Signup.tsx'
import HomePage from './Pages/Homepage.tsx'
import Signin from './Pages/Signin.tsx'
import Dashboard from './Pages/Dashboard.tsx'
import Video from './Pages/Video.tsx'
import Twitter from './Pages/Twitter.tsx'
import Sidebarfull from './components/Sidebarfull.tsx'
import VideoDetail from './components/VideoDetails.tsx'
import CreateTweet from './Pages/CreateTweet.tsx'
import WatchHistoryPage from './Pages/WatchHistory.tsx'
import Playlist from './Pages/Playlist.tsx'
const router=createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<HomePage/>} />
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/video' element={<Video/>}/>
      <Route path='/twitter' element={<Twitter/>}/>
      <Route path='/sidebar' element={<Sidebarfull/>}/>
      <Route path="/video/:videoId" element={<VideoDetail />} />
      <Route path="/createtweet" element={<CreateTweet/>}/>
      <Route path="/watchHistory" element={<WatchHistoryPage/>}/>
      <Route path='/playlist' element={<Playlist/>}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
