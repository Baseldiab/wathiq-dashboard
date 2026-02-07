import { Box } from "@mui/material";
import Image from "next/image";

export default function ImageBox({ customeStyle = {}, image }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "520px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        border: "1px solid #EBEEF3",
        borderRadius: "20px",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        ...customeStyle,
      }}
    >
      <Image
        src={image}
        alt="image preview"
        layout="fill"
        objectFit="cover"
        // width={0} // Allow dynamic resizing
        // height={0}
        // style={{
        //   width: "100%",
        //   height: "98px",
        // }}
      />
    </Box>
  );
}
