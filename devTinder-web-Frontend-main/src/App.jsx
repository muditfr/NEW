import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import appStore from "./utils/appStore";
import { Provider } from "react-redux"; 
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter basename="/">
     <Routes>
        <Route path="/" element={<Body/>}>
        <Route path="/" element={<Feed/>}></Route>
         <Route path="/login" element={<Login/>}></Route>
         <Route path="/profile" element={<Profile/>}></Route>
         <Route path="/connections" element={<Connections/>}></Route>
         <Route path="/requests" element={<Requests/>}></Route>
         <Route path="/admin" element={<AdminDashboard/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
    </>
  );
}


export default App;
