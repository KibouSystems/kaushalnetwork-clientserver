import { Link } from "react-router";

export default function Navbar() {
  return (
    <div style={{ padding: "2rem", display: "flex", gap: "1rem" }}>
      <Link to={"/"}>Home</Link>
      <Link to={"/signup"}>Sign Up</Link>
      <Link to={"/register-company"}>Register Company</Link>
    </div>
  );
}
