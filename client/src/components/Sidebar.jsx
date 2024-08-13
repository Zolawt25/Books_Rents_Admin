import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import LoginIcon from "@mui/icons-material/Login";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useLocation } from "react-router-dom";
import { defineAbilitiesFor } from "../../util/abilities.js";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const location = useLocation().pathname.split("/")[1];
  const drawerWidth = 240;
  const [isDisable, setIsDisable] = useState(false);
  const navigate = useNavigate();
  const cookie = new Cookies();
  const token = cookie.get("user_token");
  const filteredToken = token ? token : sessionStorage.getItem("user_token");
  const decodedToken = filteredToken ? jwtDecode(filteredToken) : "";
  const isAdmin = `${decodedToken.isadmin ? "admin" : "owner"}`;
  const [role, setRole] = useState(isAdmin);
  const ability = defineAbilitiesFor(role);

  const handleLogout = () => {
    if (cookie.get("user_token")) {
      cookie.remove("user_token");
      navigate("/login");
      window.location.reload();
    } else if (sessionStorage.getItem("user_token")) {
      sessionStorage.removeItem("user_token");
      navigate("/login");
      window.location.reload();
    }
  };

  useEffect(() => {
    if (location === "login" || location === "signup") {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [location]);

  const drawerLinks1 = [
    {
      text: "Dashboard",
      icon: <SpaceDashboardOutlinedIcon />,
      path: "",
    },
    {
      text: ability.can("manage", "all") ? "Books" : "Book Upload",
      icon: <MenuBookIcon />,
      path: ability.can("manage", "all") ? "books" : "Book_Upload",
    },
    {
      text: ability.can("manage", "all") ? "Owners" : "Other",
      icon: ability.can("manage", "all") ? (
        <PermIdentityIcon />
      ) : (
        <ControlPointIcon />
      ),
      ...(ability.can("manage", "all") && { path: "owners" }),
    },
    {
      text: "Other",
      icon: <ControlPointIcon />,
    },
    {
      text: "Other",
      icon: <ControlPointIcon />,
    },
  ];

  const drawerLinks2 = [
    {
      text: "Notification",
      icon: <NotificationsNoneIcon />,
    },
    {
      text: "Settings",
      icon: <SettingsOutlinedIcon />,
    },
    {
      text: role === "admin" ? "Login as owner" : "Login as admin",
      icon: <AccountCircleOutlinedIcon />,
      path: "/login",
    },
  ];

  return (
    <Box sx={isDisable && { display: "none" }}>
      <AppBar
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          bgcolor: "inherit",
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            bgcolor: "white",
            m: 1,
            ml: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography sx={{ color: "black", fontWeight: "bold" }}>
            {ability.can("manage", "all") ? "Admin " : "Owner "}
            <Box
              component={"span"}
              sx={{
                color: "gray",
                textTransform: "capitalize",
                fontWeight: 200,
              }}
            >
              / {location ? location : "Dashboard"}
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            p: 1,
            bgcolor: "#F0F2FF",
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            bgcolor: "#171B36",
            borderRadius: 3,
            py: "8px",
          }}
        >
          <Typography
            variant="h5"
            color="#0EA4F9"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              gap: 1,
            }}
          >
            <Box
              component={"img"}
              src="/loginIcon.png"
              alt="logo"
              sx={{ width: "15%" }}
            />
            Book Rent
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "94.5%",
              px: 1,
            }}
          >
            <Box flexGrow={1}>
              <Box mt={4}>
                <List>
                  {drawerLinks1.map((item, index) => (
                    <ListItemButton
                      key={index}
                      to={`/${item.path ? item.path : ""}`}
                      sx={{
                        borderRadius: 1,
                        bgcolor: `${location === item.path && "#00ABFF"}`,
                        ":hover": {
                          bgcolor: "#446497",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#eeeeee",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {item.icon}
                        {item.text}
                      </Typography>
                    </ListItemButton>
                  ))}
                </List>
                <List>
                  {drawerLinks2.map((item, index) => (
                    <ListItemButton
                      key={index}
                      to={item.path}
                      sx={{
                        borderRadius: 1,
                        ":hover": {
                          bgcolor: "#446497",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#eeeeee",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          ":hover": {
                            bgcolor: "#446497",
                          },
                        }}
                      >
                        {item.icon}
                        {item.text}
                      </Typography>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Box>
            <Button
              sx={{
                justifySelf: "end",
                bgcolor: "#45495E",
                color: "#d1d1d1",
                textTransform: "capitalize",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => handleLogout()}
            >
              <LoginIcon sx={{ color: "#d1d1d1", fontSize: "18px" }} />
              logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
