"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { socket } from "@/app/socket";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connection successfull" + socket.id);
      socket.emit("JoinRoom", user.id);
    });

    socket.on("enroll-student", ({ message }) => {
      console.log(message);
      setNotification(message);
      setOpen(true);
    });
    return () => {
      socket.off("enroll-student");
      socket.off("connect");
    };
  }, [user.id]);

  if (!user || user.role !== "STUDENT") {
    router.push("/auth/login");
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div>
        <Snackbar
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification && notification}
          </Alert>
        </Snackbar>
        s
      </div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
