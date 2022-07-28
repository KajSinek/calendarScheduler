import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  IconButton,
  Avatar,
  Popover,
  List,
  ListSubheader,
  ListItemButton,
} from "@mui/material";
import OnlineIndicator from "./OnlineIndicator";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { isLoggedIn, account, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [popover, setPopover] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [register, setRegister] = useState(false);

  const openPopover = (e) => {
    setPopover(true);
    setAnchorEl(e.currentTarget);
  };

  const closePopover = () => {
    setPopover(false);
    setAnchorEl(null);
  };

  const clickLogin = () => {
    setRegister(false);
    setAuthModal(true);
    closePopover();
  };

  const clickRegister = () => {
    setRegister(true);
    setAuthModal(true);
    closePopover();
  };

  return (
    <AppBar className="header" position="static">
      <h1>Web App</h1>
      <ul className="navbar-nav mr-auto d-flex flex-row gap-3">
        <li className="nav-item active">
          <Link className="nav-link" to={`/`}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/scheduler`}>
            Scheduler
          </Link>
        </li>
      </ul>

      <IconButton onClick={openPopover}>
        <OnlineIndicator online={isLoggedIn}>
          <Avatar src={account?.username || ""} alt={account?.username || ""} />
        </OnlineIndicator>
      </IconButton>

      <Popover
        anchorEl={anchorEl}
        open={popover}
        onClose={closePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List style={{ minWidth: "100px" }}>
          <ListSubheader style={{ textAlign: "center" }}>
            Hello, {isLoggedIn ? account.username : "Guest"}
          </ListSubheader>

          {isLoggedIn ? (
            <ListItemButton onClick={logout}>Logout</ListItemButton>
          ) : (
            <Fragment>
              <ListItemButton onClick={clickLogin}>Login</ListItemButton>
              <ListItemButton onClick={clickRegister}>Reigster</ListItemButton>
            </Fragment>
          )}
        </List>
      </Popover>

      <AuthModal
        open={authModal}
        close={() => setAuthModal(false)}
        isRegisterMode={register}
        toggleRegister={() => setRegister((prev) => !prev)}
      />
    </AppBar>
  );
}
