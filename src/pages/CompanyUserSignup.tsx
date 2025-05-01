import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../configs/firebase';
import React from 'react';

export default function CompanyUserSignup() {
  const handleSignInWithGoogle = () =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signInWithPopup(auth, googleAuthProvider).then((result) => {
      // Token and user and Credentials where not in use so commented uncomment when needed
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // const user = result.user;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      credential?.accessToken;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      result.user;
    });
  // const handleSignInWithGoogle = () =>
  //   signInWithRedirect(auth, googleAuthProvider);

  // React.useEffect(() => {
  //   getRedirectResult(auth)
  //     .then((result) => {
  //       if (result?.user) {
  //         console.log("hi");
  //         console.log(result);
  //       }
  //       if (auth.currentUser) {
  //         console.log(auth.currentUser);
  //       }
  //       console.log(result, auth.currentUser);

  //       const credential =
  //         result && GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential && credential.accessToken;
  //       console.log(token);

  //       // The signed-in user info.
  //       const user = result?.user;
  //       console.log(user);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => location.reload());
  };

  return (
    <div>
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
