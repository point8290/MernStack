import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  SwiperCore.use(Navigation);
  const params = useParams();
  useEffect(() => {
    const getListing = async () => {
      try {
        setLoading(true);
        const listingId = params.id;
        const res = await fetch(`/api/listing/${listingId}`);
        const data = await res.json();
        setLoading(false);
        if (data.success == false) {
          console.log("listing not found");
          setError(true);
          return;
        }
        setListing(data);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };
    getListing();
  }, []);
  return (
    <main>
      {loading && <p className="text-center text-2xl my-7">Loading...</p>}
      {!loading && error && (
        <p className="text-center text-2xl my-7">{error.message}</p>
      )}
      {!loading && !error && listing && (
        <>
          <Swiper navigation>
            {listing.imageUrls.map((url) => {
              return (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      )}
    </main>
  );
};
