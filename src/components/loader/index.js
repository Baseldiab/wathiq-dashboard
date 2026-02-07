import Backdrop from "@/components/backdrop";
import { Box } from "@mui/material";

export default function Loader({ open }) {
  return (
    <Backdrop
      open={open}
      onClick={(e) => e.stopPropagation()}
      component={
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            maxHeight: "85%",
            overflow: "auto",
            width: "100%",
            textAlign: "center",
            display:"flex",
            justifyContent:"center"
          }}
        >
          <div className="loader">
            {/* <svg viewBox="0 0 86 80">
              <polygon points="43 8 79 72 7 72"></polygon>
            </svg> */}
          </div>
        </Box>
      }
    />
  );
}
