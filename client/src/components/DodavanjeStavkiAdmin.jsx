import React, { useState, useEffect, useRef, useContext } from "react";
import imageCompression from "browser-image-compression";
import { EndpointUrlContext } from "../kontekst/EndpointUrlContext";

const DodavanjeStavkiAdmin = ({
  fields = [],
  title = "Stavka",
  submitUrl = "",
  editUrl = null,
  isEdit = false,
  defaultValues = {},
  onSuccess = () => {},
}) => {
  const [formData, setFormData] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [message, setMessage] = useState("");
  const [slika, setSlika] = useState(null);
  const { endpointUrl } = useContext(EndpointUrlContext);
  const [compressedImage, setCompressedImage] = useState(null);

  function getFileExtension(mimeType) {
    const map = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
    };
    return map[mimeType] || ".jpg";
  }

  const handleSlikaChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressed = await imageCompression(file, options);

      setSlika(URL.createObjectURL(compressed));
      setCompressedImage(compressed);
    } catch (err) {
      console.error("Greška pri kompresiji slike:", err);
    }
  };

  const isInitialized = useRef(false);
  useEffect(() => {
    if (isEdit && defaultValues && !isInitialized.current) {
      setFormData(defaultValues);
      setPreviewImages({});
      isInitialized.current = true;
    } else if (!isEdit && !isInitialized.current) {
      setFormData({});
      setPreviewImages({});
      isInitialized.current = true;
    }
  }, [isEdit, defaultValues]);

  if (isEdit && !defaultValues) {
    return <div className="text-white">Učitavanje podataka...</div>;
  }

  const handleChange = async (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      if (!file) return;

      try {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressed = await imageCompression(file, options);

        setFormData((prev) => ({ ...prev, [name]: compressed }));
        setPreviewImages((prev) => ({
          ...prev,
          [name]: URL.createObjectURL(compressed),
        }));
      } catch (err) {
        console.error("Greška pri kompresiji slike:", err);
        setMessage("Greška pri kompresiji slike.");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    if (compressedImage) {
      const extension = getFileExtension(compressedImage.type);
      const fileWithExtension = new File(
        [compressedImage],
        `image_${Date.now()}${extension}`,
        { type: compressedImage.type }
      );

      data.append("slika", fileWithExtension);
    }

    try {
      const res = await fetch(
        isEdit
          ? `${endpointUrl}${editUrl}` || submitUrl
          : `${endpointUrl}${submitUrl}`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            Authorization: `Token ${sessionStorage.getItem("token")}`,
          },
          body: data,
        }
      );

      const result = await res.json();

      if (res.ok) {
        setMessage(`${title} uspješno ${isEdit ? "uređen" : "dodano"}.`);
        if (!isEdit) {
          setFormData({});
          setPreviewImages({});
        }
        onSuccess(result);
      } else {
        setMessage(`Greška: ${result.error || "nepoznata greška"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Došlo je do greške prilikom slanja.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl min-w-[30rem]   p-4  rounded-[13px] my-10 outline outline-[4px] outline-white px-10 font-glavno"
    >
      <h2 className="my-2 text-xl font-semibold">
        {isEdit ? `Uredi ${title}` : `Dodaj ${title}`}
      </h2>

      {fields.map((field) => (
        <div
          key={field.name}
          className={`gap-1 ${
            field.type === "checkbox"
              ? "flex flex-row items-center my-3"
              : "flex flex-col"
          }`}
        >
          {field.type === "checkbox" ? (
            <>
              <input
                type="checkbox"
                name={field.name}
                checked={!!formData[field.name]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label className="font-medium">{field.label}</label>
            </>
          ) : (
            <>
              <label className="font-medium">{field.label}</label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="p-2 border rounded-[9px] mb-4 text-moja_plava font-medium"
                  rows={4}
                />
              ) : field.type === "file" ? (
                <>
                  <input
                    type="file"
                    name={field.name}
                    accept={field.accept || "*"}
                    onChange={handleSlikaChange}
                    className="p-2 border rounded-[9px]"
                  />
                  {slika && (
                    <div className="w-full flex items-center justify-center rounded-[11px] ">
                      <img
                        src={slika}
                        alt="Odabrana slika"
                        className="w-full h-auto rounded-[9px] border-2 border-white"
                      />
                    </div>
                  )}
                </>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="p-2 border rounded-[9px] mb-3 text-moja_plava font-medium"
                />
              )}
            </>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 mt-8 text-white rounded-[7px] bg-moja_plava-tamna hover:px-6 outline outline-2 outline-white form-btn-hover"
      >
        {isEdit ? "Spremi promjene" : "Dodaj"}
      </button>

      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </form>
  );
};

export default DodavanjeStavkiAdmin;
