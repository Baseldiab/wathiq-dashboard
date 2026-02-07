import React, { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./navbar";
import { Box } from "@mui/material";

export default function Layout({ component }) {
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div className="layout-container">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar} />
        <Box
          sx={{
            padding: "32px 24px",
            // background:
            //   "linear-gradient(270deg, rgba(255, 255, 255, 0.06) 9.31%, rgba(19, 92, 88, 0.06) 100%)",
            // bgcolor: "#FAFAFA",
            // height: "100vh",
            minHeight: "100vh",
          }}
        >
          {component}
        </Box>
      </main>
    </div>
  );
}
