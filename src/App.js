import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import GuessBox from "./guessBox/guessBox";
import AdminPanel from './adminPanel';


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
    return <RouterProvider basename="/wordle" router={router}/>
}

export default App;
