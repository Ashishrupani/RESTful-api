import FloatingShape from "./components/FloatingShape.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import { Route, Routes , Navigate} from "react-router-dom";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import HomePage from "./pages/HomePage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

//Protect Routes that need auth
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if(!isAuthenticated){
    return <Navigate to="/login" replace/>;
  }

  if(!user.isVerified){
    return <Navigate to="/verify-email" replace/>;
  }

  //if auth and verified pass
  return children;

}

//Redirect authenticated users
const RedirectAuthenticatedUser = ({children})=> {
  const {isAuthenticated, user} = useAuthStore();

  if(isAuthenticated && user.isVerified){
    return <Navigate to="/" replace/>
  }

  return children;

}

//Only verify Authenticated users
const ProtectedVerifyEmailRoute = ({children}) => {
  const {isAuthenticated, user} = useAuthStore();

  if (user && user.isVerified){
    return <Navigate to = "/" replace/>;
  }

  if (user && isAuthenticated){
    return children;
  }

  return <Navigate to = "/" replace/>;
}

function App() {
  const { isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-sky-900 
    flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape
        color="bg-blue-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-sky-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-blue-300"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      <Routes>
        <Route path="/" element={<ProtectedRoute> <HomePage/> </ProtectedRoute>} />
        <Route path="/signup" element={<RedirectAuthenticatedUser> <SignUpPage/> </RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser> <LogInPage/> </RedirectAuthenticatedUser>} />
        <Route path="/verify-email" element={ <ProtectedVerifyEmailRoute><VerifyEmailPage /></ProtectedVerifyEmailRoute>} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser> <ForgotPasswordPage/> </RedirectAuthenticatedUser>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
