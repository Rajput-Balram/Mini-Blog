import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const CreatAccPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const signUp = async () => {
    try {
      if (password != confirmPassword)
        throw new Error("password and confirm password not matching");

      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>create acc page</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={signUp}>Sign Up</button>
      <Link to={"/login"}>Already have Account? Login Here.</Link>
    </>
  );
};
export default CreatAccPage;
