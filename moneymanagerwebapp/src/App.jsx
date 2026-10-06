import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Home = lazy(() => import("./pages/Home"));
const Category = lazy(() => import("./pages/Category"));
const Income = lazy(() => import("./pages/Income"));
const Expense = lazy(() => import("./pages/Expense"));
const Filter = lazy(() => import("./pages/Filter"));

const PageLoader = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <LoaderCircle className="animate-spin w-8 h-8 text-purple-700" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        toastOptions={{
          className: "dark:!bg-gray-800 dark:!text-gray-100",
        }}
      />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/category" element={<Category />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="*" element={<Root />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
