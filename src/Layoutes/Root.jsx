import { Outlet } from "react-router-dom";
import Navbar from "../Pages/Shared/Navbar/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";
import useUserRole from "../CustomHooks/useUserRole";

const Root = () => {
  const { userRole, loading } = useUserRole();

  if (loading) {
    return (
      <>
        <h1>Loading............</h1>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen roboto">
      {userRole !== "admin" && (
        <header>
          <Navbar />
        </header>
      )}
      <main className="flex-grow">
        <Outlet />
      </main>
      {userRole !== "admin" && (
        <footer>
          <Footer />
        </footer>
      )}
    </div>
  );
};

export default Root;
