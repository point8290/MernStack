import { useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  console.log("formData", formData);
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
  return (
    <main className="p-2 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
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
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            name="description"
            className="border p-2 rounded-lg"
            required
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            name="address"
            className="border p-2 rounded-lg"
            required
          />
          <div className="flex gap-6 flex-wrap ">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-300"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-300"
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
              />
              <p>Bath</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-300"
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center">
                <p>Price</p>
                <span className="text-xs"> ($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-2 border-gray-300"
                type="number"
                id="discountedPrice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs"> ($/month)</span>
              </div>
            </div>
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
              className="border-gray-300 rounded p-2 w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={imageUploadLoading}
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
          <button className="p-2  bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
