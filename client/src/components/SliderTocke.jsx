import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { PaginationContext } from "../kontekst/PaginationContext";
import { useContext } from "react";

function valuetext(value) {
  return value;
}

export default function WhiteSlider({ values }) {
  const { currentPage, setCurrentPage, itemsPerPage, setItemsPerPage } =
    useContext(PaginationContext);

  const handleChange = (event, newValue) => {
    setItemsPerPage(newValue);
    setCurrentPage(1);
  };
  return (
    <Box sx={{ width: "100%" }}>
      {" "}
      {/* Optional black bg for contrast */}
      <Slider
        aria-label="White slider"
        defaultValue={values.default}
        value={itemsPerPage}
        onChange={handleChange}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={values.step}
        marks
        min={values.min}
        max={values.max}
        sx={{
          color: "#ffffff", // track + thumb
          "& .MuiSlider-thumb": {
            backgroundColor: "white",
          },
          "& .MuiSlider-rail": {
            backgroundColor: "#ffffff",
            opacity: 0.5,
          },
          "& .MuiSlider-track": {
            backgroundColor: "#ffffff",
          },
          "& .MuiSlider-mark": {
            backgroundColor: "#ffffff",
            width: "9px",
            height: "9px",
            borderRadius: "50%",
          },
          "& .MuiSlider-markActive": {
            backgroundColor: "#ffffff",
          },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "#ffffff",
            color: "black",
          },
        }}
      />
    </Box>
  );
}
