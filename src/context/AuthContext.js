import React, { createContext, useContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "893152668989-cueptj9acpadhtonuv58k4dq4rdoitdt.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = auth.GoogleAuthProvider.credential(id_token);
      auth().signInWithCredential(credential);
    }
  }, [response]);

  const signInWithGoogle = async () => {
    promptAsync();
  };

  const signOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
