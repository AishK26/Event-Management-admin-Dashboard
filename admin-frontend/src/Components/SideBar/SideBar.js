import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Modal from "@mui/material/Modal";
// import Drawer from '@mui/material/Drawer';
import Popover from "@mui/material/Popover";

import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CurrencyRupeeTwoToneIcon from "@mui/icons-material/CurrencyRupeeTwoTone";
import TaskTwoToneIcon from "@mui/icons-material/TaskTwoTone";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
// import Scrollbars from "react-custom-scrollbars";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import GridViewIcon from "@mui/icons-material/GridView";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Tooltip from "@mui/material/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SideBar.css";
import {
  FaBars,
  FaThLarge,
  FaUser,
  FaListUl,
  FaSearch,
  FaTasks,
  FaRegListAlt,
  FaSignOutAlt,
  FaCreditCard,
  FaClipboardList,
  FaRegFilePdf,
  FaRegBell,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  faBell,
  faTasks,
  faPersonShelter,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
// const CustomScrollbars = styled(Scrollbars)`
//   /* Add your custom scrollbar styles here */
//   width: 100%;
//   height: 100%;

//   /* Track */
//   .track-vertical {
//     background-color: transparent;
//   }

//   /* Thumb */
//   .thumb-vertical {
//     background-color: #888;
//     border-radius: 5px;
//   }

//   /* Thumb on hover */
//   .thumb-vertical:hover {
//     background-color: #555;
//   }
// `;

export default function SideBar() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activetab, setActivetab] = useState(() => {
    return sessionStorage.getItem("activetab") || "";
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    console.log("activetab", activetab);
    console.log("open", open);
  }, [activetab, open]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleClick = (event, tab) => {
    // Pass tab as argument
    setAnchorEl(event.currentTarget);
    setActivetab(tab); // Update active tab state
    sessionStorage.setItem("activetab", tab);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <div className="header-component">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
                color: "white",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white" }}
            >
              {activetab}
            </Typography>
          </Toolbar>
        </div>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <div className="one">
          <DrawerHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: "white",
                  backgroundImage: "linear-gradient( #fff)",
                  paddingInline: "15px",
                  borderRadius: "5px",
                  width: "100%",
                  textAlign: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "white",
                }}
              >
                VirtuElite
              </Typography>
            </motion.div>
            <IconButton
              onClick={handleDrawerClose}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "#00aef7", // Adjust alpha for desired faintness
                },
              }}
            >
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
        </div>
        <div className=" bg-blue-800  ">
          <Divider />
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "DashBoard")}
            >
              <div className="menuitems-of-header ">
                <Link
                  to="/dashboard"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton
                    className={
                      activetab === "DashBoard"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="DashBoard">
                        <span>
                          <FaThLarge color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary=" DashBoard"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Client")}
            >
              <div className="menuitems-of-header">
                <Link to={"/clientcontainer"}>
                  <ListItemButton
                    className={
                      activetab === "Client"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Client">
                        <span>
                          <FontAwesomeIcon icon={faUsers} color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="Client"
                      sx={{
                        opacity: open ? 1 : 0,
                        color: "#fff",
                      }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
          </List>

          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Create Enquiry")}
            >
              <div className="menuitems-of-header ">
                <Link to={"/enquirycontainer"}>
                  <ListItemButton
                    className={
                      activetab === "Create Enquiry"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Create Enquiry">
                        <span>
                          <FaClipboardList color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="  Enquiry"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "Create Enquiry" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/addenquiry"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Add</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/viewenquiry"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">View</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Proposal")}
            >
              <div className="menuitems-of-header ">
                <Link to={"/proposalcontainer"}>
                  <ListItemButton
                    className={
                      activetab === "Proposal"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Proposal">
                        <span>
                          <FaSearch color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary=" Proposal"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "Proposal" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/createproposal"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Create Proposal</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/viewproposal"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">View Proposal</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Payment")}
            >
              <div className="menuitems-of-header ">
                <Link to={"/paymentcontainer"}>
                  <ListItemButton
                    className={
                      activetab === "Payment"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Payment">
                        <span>
                          <FaCreditCard color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="Payment"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "Payment" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/advancepayment"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Add Payment</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/viewadvancepayment"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">View Payment</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Event")}
            >
              <div className="menuitems-of-header ">
                <Link to={"/eventcontainer"}>
                  <ListItemButton
                    className={
                      activetab === "Event"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Event">
                        <span>
                          <FaRegListAlt color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary=" Event"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "Event" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/approvedevent"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Approved Events</span>
                  </Link>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                  <Link
                    to={"/assignevent"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Assign Event</span>
                  </Link>
                </MenuItem> */}
            {/* <MenuItem onClick={handleClose}>
                  <Link
                    to={"/eventdetails"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Event Details</span>
                  </Link>
                </MenuItem> */}
            {/* </Menu> */}
            {/* )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "View Task")}
            >
              <div className="menuitems-of-header ">
                <Link to="/tasks">
                  <ListItemButton
                    className={
                      activetab === "View Task"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="View Task">
                        <span>
                          <FontAwesomeIcon icon={faTasks} color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary="  Task"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "View Task" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/createtask"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Create Task</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/managertask"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Manager Task</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/executivetask"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Executive Task</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Master")}
            >
              <div className="menuitems-of-header ">
                <Link to="/master">
                  <ListItemButton
                    className={
                      activetab === "Master"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Master">
                        <span>
                          <FontAwesomeIcon
                            icon={faPersonShelter}
                            color="#fff"
                          />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary=" Master"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "Master" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/addevent1"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Add Event</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/viewevent1"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> View event</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/addvendor"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Add Vendor</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/viewvendor"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> View Vendor</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "User Management")}
            >
              <div className="menuitems-of-header ">
                <Link to="/usermanagement">
                  <ListItemButton
                    className={
                      activetab === "User Management"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="User Management">
                        <span>
                          <FaUser color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary=" User Management"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "User Management" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/addexecutive"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Add Executive</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/addmanager"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Add Manager</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/executivedetails"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">View Executive</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/managerdetails"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">View Manager</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Notifications")}
            >
              <div className="menuitems-of-header ">
                <ListItemButton
                  className={
                    activetab === "Notifications"
                      ? "menuitems-of-header active"
                      : "menuitems-of-header"
                  }
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Notifications">
                      <span>
                        <FontAwesomeIcon color="#fff" icon={faBell} />
                      </span>
                    </Tooltip>
                  </ListItemIcon>
                  <ListItemText
                    primary=" Notifications"
                    sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                  />
                </ListItemButton>
              </div>
            </ListItem>
            {activetab === "Notifications" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/notifications"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">View</span>
                  </Link>
                </MenuItem>
                {/* <MenuItem onClick={handleClose}>
                  <Link
                    to={"/createnotifications"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text">Create New</span>
                  </Link>
                </MenuItem> */}
              </Menu>
            )}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={(event) => handleClick(event, "Report")}
            >
              <div className="menuitems-of-header ">
                <Link to={"/reportcontainer"}>
                  <ListItemButton
                    className={
                      activetab === "Report"
                        ? "menuitems-of-header active"
                        : "menuitems-of-header"
                    }
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#3b82f6",
                        transform: "scale(1.05)",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip title="Report">
                        <span>
                          <FaRegFilePdf color="#fff" />
                        </span>
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                      primary=" Report"
                      sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                    />
                  </ListItemButton>
                </Link>
              </div>
            </ListItem>
            {/* {activetab === "Report" && (
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/eventreport"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Event Report</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/enquiryreport"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Enquiry Report</span>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to={"/paymentreport"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="icon-text"> Payment Report</span>
                  </Link>
                </MenuItem>
              </Menu>
            )} */}
          </List>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
             // onClick={(event) => handleClick(event, "Logout")}
             onClick={handleLogout}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#3b82f6",
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Tooltip title="Logout">
                    <span>
                      <FaSignOutAlt onClick={handleLogout} color="#fff" />
                    </span>
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary=" Logout"
                  sx={{ opacity: open ? 1 : 0, color: "#fff" }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
        </div>
      </Drawer>
    </Box>
  );
}
