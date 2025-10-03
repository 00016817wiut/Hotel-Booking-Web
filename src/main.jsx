import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider  } from 'react-router-dom';
import RoomDetails from './components/Main/Rooms/RoomDetails.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import Rooms from './components/Main/Rooms/Rooms.jsx';

const router  = createBrowserRouter ([
  {path : '/', element: <App/>},
  {path : '/rooms', element: <Rooms/>}, 
  {path : '/room/:id', element: <RoomDetails/>}, 
  {path : '*', element: <PageNotFound/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <RouterProvider router={router}/>
  </StrictMode>,
)
