import './App.css';
import GuessBox from "./guessBox/guessBox";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Room from './roomBox/room';

function App() {
    return (
    <BrowserRouter>
    <Routes>
    <Route exact path='/' element={<GuessBox/>}></Route>
    <Route  exact path='/:id' element={<Room/>}></Route>

    </Routes>
    </BrowserRouter>
    )
}

export default App;
