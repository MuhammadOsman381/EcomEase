import Layout from "./pages/Layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserLayout from "./pages/UserLayout";
import Profile from "./pages/Profile";
import Helpers from "./config/Helpers";
import Cart from "./pages/Cart";
import Products from "./pages/Products";

function Auth({ children, isAuth = true }) {
  const user = Helpers.getItem("user", true);
  const token = Helpers.getItem("token", false);

  if (isAuth) {
    if (!user || !token) {
      Helpers.toast("error", "Please login to continue");
      return <Navigate to="/" />;
    }
    return children;
  } else {
    if (user && token) {
      return <Navigate to="/user/home" />;
    }
    return children;
  }
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Auth isAuth={false}>
                <Layout />
              </Auth>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route
            path="/user"
            element={
              <Auth>
                <UserLayout />
              </Auth>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="products" element={<Products />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
