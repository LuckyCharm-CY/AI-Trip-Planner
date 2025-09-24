// All the routing configuration
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import CreateTrip from './create-trip/index.jsx'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './view-trip/[tripid]'
import MyTrips from './my-trips'
// Paths/ Routes

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/create-trip',
    element: <CreateTrip/>
  },
  {
    path: '/view-trip/:tripId',
    element: <ViewTrip/>
  },
  {
    path: '/my-trips',
    element: <MyTrips/>
  }
])

// fixed parts of the site (e.g Header)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>

      <Header/> 
      <Toaster/>
      <RouterProvider router={ router }/>
    </GoogleOAuthProvider>
  </StrictMode>,
)
