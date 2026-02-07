import React from 'react'

export default function SingleCard() {
  return (
    <div>SingleCard</div>
  )
}
// // import { Card, Typography, Box, Chip, useTheme, Grid } from "@mui/material";
// // import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// // import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// // import { formatNumber } from "@/services/utils";
// // import constants from "@/services/constants";

// // export default function StatsCard({ stats }) {
// //   return (
//     // <Card
//     //   sx={{
//     //     borderRadius: 3,
//     //     boxShadow: 3,
//     //     p: 3,
//     //     mb: 4,
//     //     backgroundColor: "#fff",
//     //   }}
//     // >
//     //   <Typography variant="h6" mb={3} fontWeight="bold">
//     //     إحصائيات المحافظ
//     //   </Typography>

//     //   {stats.map((stat, idx) => {
//     //     const {
//     //       title,
//     //       current,
//     //       previous,
//     //       percentage,
//     //       isMoney,
//     //       positiveIsUp = true,
//     //     } = stat;

//     //     const calcPercentage = () => {
//     //       if (percentage !== undefined) return percentage;
//     //       if (!previous || !current) return undefined;
//     //       return +(((current - previous) / previous) * 100).toFixed(2);
//     //     };

//     //     const change = calcPercentage();
//     //     const isPositive = change >= 0;

//     //     return (
//     //       <Box
//     //         key={title}
//     //         display="flex"
//     //         justifyContent="space-between"
//     //         alignItems="flex-start"
//     //         borderBottom={idx !== stats.length - 1 ? "1px solid #eee" : "none"}
//     //         py={2}
//     //         gap={2}
//     //         flexWrap="wrap"
//     //       >
//     //         {/* العنوان والقيم */}
//     //         <Box>
//     //           <Typography sx={{ color: "#444", fontSize: 14, mb: 0.5 }}>
//     //             {title}
//     //           </Typography>
//     //           <Typography sx={{ fontSize: 13, color: "#1b5e20" }}>
//     //             <strong>
//     //               {formatNumber(current)}
//     //               {isMoney &&
//     //                 constants.symbol({
//     //                   width: { xs: "10px", md: "10px" },
//     //                   ml: 0.5,
//     //                 })}
//     //             </strong>
//     //           </Typography>
//     //           {previous !== undefined && (
//     //             <Typography sx={{ fontSize: 12, color: "#888", mt: 0.3 }}>
//     //               السابقة: {formatNumber(previous)}
//     //               {isMoney &&
//     //                 constants.symbol({
//     //                   width: { xs: "10px", md: "10px" },
//     //                   ml: 0.5,
//     //                 })}
//     //             </Typography>
//     //           )}
//     //         </Box>

//     //         {/* الشيب */}
//     //         {change !== undefined && change !== 0 && (
//     //           <Chip
//     //             size="small"
//     //             icon={
//     //               isPositive ? (
//     //                 <TrendingUpIcon fontSize="20px" color="#388e3c" />
//     //               ) : (
//     //                 <TrendingDownIcon fontSize="20px" color="#c62828" />
//     //               )
//     //             }
//     //             label={`${change} %`}
//     //             // label={`${isPositive ? "+" : ""}${change}%`}
//     //             sx={{
//     //               bgcolor: isPositive === positiveIsUp ? "#e8f5e9" : "#ffebee",
//     //               color: isPositive === positiveIsUp ? "#388e3c" : "#c62828",
//     //               fontSize: "10px",
//     //               height: "20px",
//     //               borderRadius: "8px",
//     //               p: 2,
//     //               alignSelf: "center",
//     //             }}
//     //           />
//     //         )}
//     //       </Box>
//     //     );
//     //   })}
//     // </Card>
// //     <Card
// //       sx={{
// //         borderRadius: 3,
// //         boxShadow: 3,
// //         p: 3,
// //         mb: 4,
// //         backgroundColor: "#fff",
// //       }}
// //     >
// //       {/* <Typography variant="h6" mb={3} fontWeight="bold">
// //         إحصائيات المحافظ
// //       </Typography> */}

// //       <Grid container spacing={2}>
// //         {stats.map((stat, idx) => (
// //           <Grid item xs={12} sm={6} key={stat.title}>
// //             <Box
// //               display="flex"
// //               justifyContent="space-between"
// //               alignItems="flex-start"
// //               p={2}
// //               border="1px solid #eee"
// //               borderRadius={2}
// //             >
// //               {/* Text Section */}
// //               <Box>
// //                 <Typography sx={{ fontSize: 14, color: "#555" }}>
// //                   {stat.title}
// //                 </Typography>
// //                 <Typography sx={{ fontSize: 13, color: "#888", mt: 0.5 }}>
// //                   <strong>{formatNumber(stat.current)}</strong>
// //                 </Typography>
// //                 <Typography sx={{ fontSize: 13, color: "#aaa" }}>
// //                   السابق: <strong>{formatNumber(stat.previous)}</strong>
// //                 </Typography>
// //               </Box>
// //               {/* Chip Section */}
// //               {stats.change !== undefined && stats.change != 0 && (
// //                 <Chip
// //                   size="small"
// //                   icon={
// //                     isPositive ? (
// //                       <TrendingUpIcon fontSize="20px" color="#0a140bff" />
// //                     ) : (
// //                       <TrendingDownIcon fontSize="20px" color="#0a140bff" />
// //                     )
// //                   }
// //                   label={`${change} %`}
// //                   // label={`${isPositive ? "+" : ""}${change}%`}
// //                   sx={{
// //                     bgcolor:
// //                       isPositive === positiveIsUp ? "#e8f5e9" : "#ffebee",
// //                     color: isPositive === positiveIsUp ? "#388e3c" : "#c62828",
// //                     fontSize: "8px",
// //                     p: 2,
// //                     height: "22px",
// //                   }}
// //                 />
// //               )}

// //             </Box>
// //           </Grid>
// //         ))}
// //       </Grid>
// //     </Card>
// //   );
// // }