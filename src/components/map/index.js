// import { useTranslation } from "next-i18next";
// // import React, { useState, useCallback } from "react";
// // import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// // import { Box } from "@mui/material";
// // import Autocomplete from "react-google-autocomplete";

// // const containerStyle = {
// //   width: "100%",
// //   height: "300px",
// // };

// // const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia

// // const GoogleMapInput = ({ value, handleChange }) => {
// //   const [marker, setMarker] = useState({
// //     latitude: value?.latitude || defaultCenter.lat,
// //     longitude: value?.longitude || defaultCenter.lng,
// //     title: value?.title || t("components_map_index.حدد_الموقع"),
// //   });

// //   const handleMapClick = useCallback(
// //     (event) => {
// //       const lat = event.latLng.lat();
// //       const lng = event.latLng.lng();

// //       // Use Reverse Geocoding API to fetch the real location name
// //       const geocoder = new window.google.maps.Geocoder();
// //       const latlng = { lat, lng };

// //       geocoder.geocode({ location: latlng }, (results, status) => {
// //         console.log("results", results);
// //         if (status === "OK" && results[0]) {
// //           const formattedTitle =
// //             results[0].address_components[0]?.long_name || t("components_map_index.موقع_محدد");

// //           const newLocation = {
// //             latitude: lat.toString(),
// //             longitude: lng.toString(),
// //             title: formattedTitle, // Save the actual location name
// //           };

// //           setMarker(newLocation);
// //           handleChange(newLocation, "location");
// //         }
// //       });
// //     },
// //     [handleChange]
// //   );

// //   return (
// //     <Box>
// //       <LoadScript
// //         googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
// //         libraries={["places"]}
// //         language="ar" // Always Arabic
// //         region="SA" // Saudi Arabia
// //       >
// //         <Autocomplete
// //           apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
// //           onPlaceSelected={(place) => {
// //             if (place.geometry) {
// //               const lat = place.geometry.location.lat();
// //               const lng = place.geometry.location.lng();

// //               // Extract the best title (prefer place name over address)
// //               const placeName =
// //                 place.name ||
// //                 place.address_components[0]?.long_name ||
// //                 place.formatted_address ||
// //                 t("components_map_index.موقع_محدد");

// //               const newLocation = {
// //                 latitude: lat.toString(),
// //                 longitude: lng.toString(),
// //                 title: placeName, // Store the actual place name in Arabic
// //               };

// //               setMarker(newLocation);
// //               handleChange(newLocation, "location");
// //             }
// //           }}
// //           options={{
// //             types: ["geocode"],
// //             componentRestrictions: { country: "SA" },
// //           }}
// //           placeholder={t("components_map_index.ابحث_عن_موقع")}
// //           style={{
// //             width: "100%",
// //             height: "40px",
// //             marginBottom: "10px",
// //             padding: "10px",
// //           }}
// //         />
// //         <GoogleMap
// //           mapContainerStyle={containerStyle}
// //           center={{
// //             lat: parseFloat(marker.latitude),
// //             lng: parseFloat(marker.longitude),
// //           }}
// //           zoom={12}
// //           onClick={handleMapClick}
// //         >
// //           <Marker
// //             position={{
// //               lat: parseFloat(marker.latitude),
// //               lng: parseFloat(marker.longitude),
// //             }}
// //           />
// //         </GoogleMap>
// //       </LoadScript>
// //     </Box>
// //   );
// // };

// // export default GoogleMapInput;

// import React, { useState, useCallback } from "react";
// import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
// import { Box, TextField } from "@mui/material";
// import Autocomplete from "react-google-autocomplete";
// import constants from "@/services/constants";

// const containerStyle = {
//   width: "100%",
//   height: "500px",
// };

// const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh, Saudi Arabia

// const GoogleMapInput = ({ value, handleChange, disabled, error }) => {
//   const { t } = useTranslation();

//   const [isMapLoaded, setIsMapLoaded] = useState(false);

//   const [location, setLocation] = useState({
//     latitude: value?.latitude || defaultCenter.lat,
//     longitude: value?.longitude || defaultCenter.lng,
//     title: value?.title || "",
//   });

//   // Unified function to update marker and input field
//   const updateLocation = (lat, lng, title) => {
//     if (disabled) return;
//     const formattedTitle = title.replace(/&nbsp;/g, " ").trim(); // Fix encoding issues

//     const newLocation = {
//       latitude: lat.toString(),
//       longitude: lng.toString(),
//       title: formattedTitle,
//     };

//     setLocation(newLocation);
//     handleChange(newLocation, "location");
//   };

//   // Handle map click
//   const handleMapClick = useCallback(
//     (event) => {
//       if (disabled || !isMapLoaded) return;
//       const lat = event.latLng.lat();
//       const lng = event.latLng.lng();

//       const geocoder = new window.google.maps.Geocoder();
//       const latlng = { lat, lng };

//       geocoder.geocode({ location: latlng }, (results, status) => {
//         if (status === "OK" && results[0]) {
//           const placeName =
//             results[0].formatted_address ||
//             results[0].address_components[0]?.long_name ||
//             t("components_map_index.موقع_محدد");

//           updateLocation(lat, lng, placeName);
//         }
//       });
//     },
//     [disabled, isMapLoaded]
//   );

//   return (
//     <Box>
//       <LoadScript
//         googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
//         libraries={["places"]}
//         language="ar"
//         region="SA"
//       >
//         {/* Unified Input Field for Search & Map Click */}
//         <Autocomplete
//           apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
//           onPlaceSelected={(place) => {
//             if (!disabled && place.geometry) {
//               const lat = place.geometry.location.lat();
//               const lng = place.geometry.location.lng();
//               const placeName =
//                 place.name ||
//                 place.formatted_address ||
//                 place.address_components?.[0]?.long_name ||
//                 t("components_map_index.موقع_محدد");

//               updateLocation(lat, lng, placeName);
//             }
//           }}
//           options={{
//             componentRestrictions: { country: "SA" },
//           }}
//           value={location.title} // Ensure input field shows marker title
//           onChange={(e) =>
//             !disabled && setLocation({ ...location, title: e.target.value })
//           } // Allow manual edits
//           placeholder={t("components_map_index.ابحث_عن_موقع")}
//           disabled={disabled}
//           style={{
//             width: "100%",
//             // height: "40px",
//             marginBottom: "10px",
//             padding: "16px",
//             fontFamily: "inherit",
//             border: "1px solid #E9E9E9",
//             outline: "0px",
//             borderRadius: "12px", // Set your desired border radius
//             fontSize: "1rem",
//             // fontWeight: 600,
//             lineHeight: "24px",
//             color: constants.colors.black,
//             // backgroundColor: disabled ? "#f5f5f5" : "white", // Gray background when disabled
//             // cursor: disabled ? "not-allowed" : "text",
//           }}
//         />
//         {error && (
//           <Box sx={{ color: "#d32f2f", fontSize: "0.75rem", m: 1 }}>
//             {error}
//           </Box>
//         )}
//         {/* Google Map */}
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={{
//             lat: parseFloat(location.latitude),
//             lng: parseFloat(location.longitude),
//           }}
//           zoom={12}
//           onClick={handleMapClick}
//           onLoad={() => setIsMapLoaded(true)} // ✅ تأكيد تحميل الخريطة
//           options={{
//             disableDefaultUI: disabled, // Disable UI when not editing
//             draggable: !disabled, // Disable map dragging when not editing
//             gestureHandling: disabled ? "none" : "auto", // Disable zoom/pan gestures
//           }}
//         >
//           <Marker
//             position={{
//               lat: parseFloat(location.latitude),
//               lng: parseFloat(location.longitude),
//             }}
//           />
//         </GoogleMap>
//       </LoadScript>
//     </Box>
//   );
// };

// export default GoogleMapInput;

import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Box } from "@mui/material";
import Autocomplete from "react-google-autocomplete";
import { useTranslation } from "next-i18next";
import constants from "@/services/constants";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 24.7136, lng: 46.6753 };

const GoogleMapInput = ({ value, handleChange, disabled, error }) => {
  const { t } = useTranslation();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    language: "ar",
    region: "SA",
  });

  const [location, setLocation] = useState({
    latitude: value?.latitude || defaultCenter.lat,
    longitude: value?.longitude || defaultCenter.lng,
    title: value?.title || "",
  });

  const updateLocation = (lat, lng, title) => {
    if (disabled) return;
    const newLocation = {
      latitude: lat.toString(),
      longitude: lng.toString(),
      title: title.replace(/&nbsp;/g, " ").trim(),
    };
    setLocation(newLocation);
    handleChange(newLocation, "location");
  };

  const handleMapClick = useCallback(
    (event) => {
      if (disabled || !isLoaded) return;
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          updateLocation(
            lat,
            lng,
            results[0].formatted_address || t("components_map_index.موقع_محدد")
          );
        }
      });
    },
    [disabled, isLoaded]
  );

  if (!isLoaded) return <p>{t("loading")}</p>;

  return (
    <Box>
      <Autocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => {
          if (!disabled && place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            updateLocation(
              lat,
              lng,
              place.name ||
                place.formatted_address ||
                t("components_map_index.موقع_محدد")
            );
          }
        }}
        options={{ componentRestrictions: { country: "SA" } }}
        value={location.title}
        onChange={(e) =>
          !disabled && setLocation({ ...location, title: e.target.value })
        }
        placeholder={t("components_map_index.ابحث_عن_موقع")}
        disabled={disabled}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "16px",
          border: "1px solid #E9E9E9",
          borderRadius: "12px",
          fontSize: "1rem",
          color: constants.colors.black,
        }}
      />
      {error && (
        <Box sx={{ color: "#d32f2f", fontSize: "0.75rem", m: 1 }}>{error}</Box>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude),
        }}
        zoom={12}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: disabled,
          draggable: !disabled,
          gestureHandling: disabled ? "none" : "auto",
        }}
      >
        <Marker
          position={{
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude),
          }}
        />
      </GoogleMap>
    </Box>
  );
};

export default GoogleMapInput;
