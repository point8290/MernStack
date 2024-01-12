function CreateListing() {
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
            />
            <button className="p-1 h-fit rounded uppercase  border text-green-700  border-green-700 hover:shadow-lg disabled:opacity:80">
              Upload
            </button>
          </div>
          <button className="p-2  bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
