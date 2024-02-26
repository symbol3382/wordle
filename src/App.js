import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import GuessBox from "./guessBox/guessBox";
import AdminPanel from './adminPanel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'


const router = createBrowserRouter([
    {
      path: "/",
      element: <GuessBox/>,
    },
    {
        path: "/admin",
        element: <AdminPanel/>,
    }
  ]);

function App() {
  return <LocalizationProvider dateAdapter={AdapterMoment}>
    <RouterProvider basename="/wordle" router={router}/>
  </LocalizationProvider>
}

export default App;
