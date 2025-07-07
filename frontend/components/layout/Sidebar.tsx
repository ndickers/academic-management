"use client";
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DescriptionIcon from "@mui/icons-material/Description";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";

import Assignment from "@/app/dashboard/lecturer/Assignment";
import Courses from "../../app/dashboard/lecturer/Courses";
import Syllabus from "@/app/dashboard/lecturer/Syllabus";
import { useAppSelector } from "@/lib/hooks";
import ViewCourses from "@/app/dashboard/student/ViewCourses";
import Enrolled from "@/app/dashboard/student/Enrolled";
import Users from "@/app/dashboard/admin/Users";
import Enrollment from "@/app/dashboard/admin/Enrollment";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

interface DemoProps {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function Sidebar() {
  const { role } = useAppSelector((state) => state.auth.user);
  let defaultPath = "/courses";

  if (role === "LECTURER") {
    defaultPath = "/courses";
  } else if (role === "STUDENT") {
    defaultPath = "/view-courses";
  } else if (role === "ADMIN") {
    defaultPath = "/users";
  }
  const router = useDemoRouter(defaultPath);

  const navigation = [];

  if (role === "LECTURER") {
    navigation.push(
      {
        segment: "courses",
        title: "Courses",
        icon: <DescriptionIcon />,
      },
      {
        segment: "assignment",
        title: "Assignment",
        icon: <DescriptionIcon />,
      },
      {
        segment: "syllabus",
        title: "AI syllabus",
        icon: <DescriptionIcon />,
      }
    );
  } else if (role === "STUDENT") {
    navigation.push(
      {
        segment: "view-courses",
        title: "View Courses",
        icon: <DescriptionIcon />,
      },
      {
        segment: "enrolled",
        title: "Enrolled Course",
        icon: <DescriptionIcon />,
      }
    );
  } else if (role === "ADMIN") {
    navigation.push(
      {
        segment: "users",
        title: "Users",
        icon: <DescriptionIcon />,
      },
      {
        segment: "courses",
        title: "Courses",
        icon: <DescriptionIcon />,
      },
      {
        segment: "enrollment",
        title: "Enrollment",
        icon: <DescriptionIcon />,
      }
    );
  }

  const AdminPages = role === "ADMIN" && (
    <>
      {router.pathname === "/users" && <Users />}
      {router.pathname === "/courses" && <Courses />}
      {router.pathname === "/enrollment" && <Enrollment />}
    </>
  );

  const LecturerPages = role === "LECTURER" && (
    <>
      {router.pathname === "/courses" && <Courses />}
      {router.pathname === "/assignment" && <Assignment />}
      {router.pathname === "/syllabus" && <Syllabus />}
    </>
  );

  const StudentPages = role === "STUDENT" && (
    <>
      {router.pathname === "/view-courses" && <ViewCourses />}
      {router.pathname === "/enrolled" && <Enrolled />}
    </>
  );

  console.log({ side: role });

  return (
    <AppProvider navigation={navigation} router={router} theme={demoTheme}>
      <DashboardLayout>
        {AdminPages && AdminPages}
        {LecturerPages && LecturerPages}
        {StudentPages && StudentPages}
      </DashboardLayout>
    </AppProvider>
  );
}
