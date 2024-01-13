import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    type: "rent",
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = file.name + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("snapshot", snapshot);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            resolve(url);
          });
        }
      );
    });
  };

  const handleFileDelete = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imageUrls: prevData.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setImageUploadLoading(true);
      setImageUploadError(null);

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData((prevData) => ({
            ...prevData,
            imageUrls: prevData.imageUrls.concat(urls),
          }));
          setImageUploadError(null);
        })
        .catch((error) => {
          console.log("error", error);
          setImageUploadError(
            "Image upload failed, You can only upload 6 images per listing (of less than 2MB)"
          );
        })
        .finally(() => {
          setImageUploadLoading(false);
        });
    } else {
      setImageUploadError(
        "You can only upload 6 images per listing (of less than 2MB)"
      );
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name == "sale" || e.target.name == "rent") {
      setFormData((prevData) => ({
        ...prevData,
        type: e.target.name,
      }));
    } else if (
      e.target.name == "parking" ||
      e.target.name == "offer" ||
      e.target.name == "furnished"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.checked,
      }));
    } else if (
      e.target.type == "number" ||
      e.target.type == "text" ||
      e.target.type == "textarea"
    ) {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1) {
      setError("You must upload atleast one image");
      return;
    }
    if (
      formData.offer &&
      parseFloat(formData.regularPrice) > parseFloat(formData.discountedPrice)
    ) {
      setError("Discounted price should be less than regular price");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: user.currentUser._id }),
      });
      setLoading(false);
      const data = await res.json();
      if (data.success == false) {
        setError(data?.message);
      } else {
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };
  return (
    <main className="p-2 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form
        className="flex flex-col py-2 sm:flex-row gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            name="name"
            className="border p-2 rounded-lg"
            maxLength={62}
            minLength={10}
            required
            value={formData.name}
            onChange={handleInputChange}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            name="description"
            className="border p-2 rounded-lg"
            required
            value={formData.description}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            name="address"
            className="border p-2 rounded-lg"
            required
            value={formData.address}
            onChange={handleInputChange}
          />
          <div className="flex gap-6 flex-wrap ">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                name="sale"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.type == "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                name="rent"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.type == "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                name="furnished"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                name="offer"
                className="w-5"
                onChange={handleInputChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-700 rounded-lg"
                type="number"
                id="bedrooms"
                name="bedrooms"
                min={1}
                required
                onChange={handleInputChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-700 rounded-lg"
                type="number"
                id="bathrooms"
                name="bathrooms"
                min={1}
                required
                onChange={handleInputChange}
                value={formData.bathrooms}
              />
              <p>Bath</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-700 rounded-lg"
                type="number"
                id="regularPrice"
                name="regularPrice"
                min={1}
                required
                onChange={handleInputChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs"> ($/month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="p-2 border-gray-700 rounded-lg"
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  min={0}
                  required
                  onChange={handleInputChange}
                  value={formData.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs"> ($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold ">
            Images:
            <span className=" text-gray-700 font-normal ml-2 text-sm ">
              The first images will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <input
              className="border-gray-700 rounded-lg  p-2 w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={loading || imageUploadLoading}
              onClick={handleImageSubmit}
              className={`p-1 h-fit rounded ${
                imageUploadLoading ? "" : "uppercase"
              } border text-green-700  border-green-700 hover:shadow-lg disabled:opacity:80`}
            >
              {imageUploadLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700"> {imageUploadError}</p>
          )}
          {formData.imageUrls?.length > 0 &&
            formData.imageUrls.map((item, index) => {
              return (
                <div
                  key={item}
                  className="flex justify-between p-2 border items-center"
                >
                  <img
                    src={item}
                    alt="listing-image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => handleFileDelete(index, e)}
                    className="p-2 bg-red-700 text-white rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={loading || imageUploadLoading}
            className={`p-2 bg-slate-700 rounded-lg text-white ${
              loading ? "" : "uppercase"
            } hover:opacity-95 disabled:opacity-80`}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700"> {error}</p>}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
