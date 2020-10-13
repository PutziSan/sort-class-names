import firebase from "firebase";
import { useEffect, useState } from "react";

type UserState =
  | { type: "init" }
  | { type: "user_loaded"; user: firebase.User }
  | { type: "not_logged_in" };
export function useAuth() {
  const [userState, setUserState] = useState<UserState>({ type: "init" });
  useEffect(() => {
    const unsubscribe = firebase.onAuthStateChanged((u) => {
      if (!u) {
        setUserState({ type: "not_logged_in" });
        return;
      }

      setUserState(
        u ? { type: "user_loaded", user: u } : { type: "not_logged_in" }
      );
    });
    return unsubscribe;
  }, []);
  return userState;
}

export function TestJsx() {
  return (
    <div>
      <div className="mt-20 flex w-screen min-h-screen">asd - whatever :-)</div>
    </div>
  );
}
