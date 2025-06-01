import { useContext, useState, useEffect } from "react";
import Select from "react-select";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

const OdabirRibe = ({ onSelect, defaultValue }) => {
  const { endpointUrl } = useContext(EndpointUrlContext);
  const [backendData, setBackendData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    fetch(endpointUrl)
      .then((res) => res.json())
      .then((data) => {
        setBackendData(data);

        if (defaultValue) {
          const defaultRiba = data.find((riba) => riba.ID === defaultValue);
          if (defaultRiba) {
            setSelectedOption({
              value: defaultRiba.ID,
              label: defaultRiba.ime,
            });
            onSelect(defaultRiba.ID); // opcionalno automatski pozvati
          }
        }
      });
  }, [endpointUrl, defaultValue]);
  const ribe = backendData.map((riba) => ({
    value: riba.ID,
    label: riba.ime,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      borderRadius: "9px",
      border: "",
      padding: "0rem 0.5rem",
      fontSize: "1rem",
      boxShadow: "none",
      height: "2.5rem",
      width: "15rem",
      color: "#6993CD",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#ffffff" : "#ffffff", // Green when selected
      color: state.isSelected ? "#6993CD" : "#6993CD", // Text color based on selection
      padding: "0.75rem 1rem",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#e6e6e6", // Light grey hover
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#888", // Grey color for the placeholder
      fontSize: "1rem",
    }),
  };
  const handleChange = (selected) => {
    setSelectedOption(selected);
    onSelect(selected.value);
  };
  return (
    <Select
      inputId="riba"
      options={ribe}
      placeholder="Odaberi ribu..."
      onChange={(selected) => {
        setSelectedOption(selected);
        onSelect(selected.value);
      }}
      isSearchable={true}
      styles={customStyles}
      name="riba_autofill"
      value={selectedOption}
      required
    />
  );
};
export default OdabirRibe;
