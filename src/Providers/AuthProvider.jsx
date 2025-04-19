import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import auth from "../Firebase/firebase.config";
// import useAxiosBase from "../CustomHooks/useAxiosBase";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  // const axiosBase = useAxiosBase();

  const createUser = (email, pass) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const setNameAndPhoto = (name, photoUrl) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoUrl,
    });
  };

  const logIn = (email, pass) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const setCustomUser = (customUser) => {
    setUser(customUser);
    localStorage.setItem("adminUser", JSON.stringify(customUser));
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminUser");
    if (storedAdmin) {
      setUser(JSON.parse(storedAdmin));
      setLoading(false);
      return; // 🔁 skip Firebase listener if admin
    }
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // if (currentUser){
      //     const userInfo = {email: currentUser.email};
      //     axiosBase.post("/jwt", userInfo)
      //     .then(res =>{
      //         if (res.data.token){
      //             localStorage.setItem("accessToken", res.data.token);
      //         }
      //     })
      // }
      // else{
      //     localStorage.removeItem("accessToken");
      // }
      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    setNameAndPhoto,
    logIn,
    googleSignIn,
    logOut,
    setCustomUser,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node,
};
