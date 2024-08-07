import axios from "axios";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // import the carousel styles
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showProductCard, setShowProductCard] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getLimitedProducts = () => {
    axios
      .get("https://fakestoreapi.in/api/products?limit=5")
      .then((response) => {
        setProducts(response.data.products);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllproducts = () => {
    axios
      .get("https://fakestoreapi.in/api/products")
      .then((response) => {
        setAllProducts(response.data.products);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const truncateDescription = (desc, wordLimit) => {
    const words = desc.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return desc;
  };

  const setValues = ([
    productTitle,
    productImg,
    productPrice,
    productDesc,
    productModel,
  ]) => {
    setModel(productModel);
    setTitle(productTitle);
    setImage(productImg);
    setPrice(productPrice);
    setDescription(truncateDescription(productDesc, 100));
    setShowProductCard(true);
  };

  useEffect(() => {
    getLimitedProducts();
    getAllproducts();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!showProductCard && (
            <div className=" flex flex-col mt-0 gap-5 items-center justify-center w-full h-full">
              <div className="rounded-xl flex flex-col items-start justify-center mt-20 w-[70vw] max-sm:w-[90vw] h-full">
                <h1 className="w-full p-0 font-semibold text-gray-600 text-[23px]">
                  Top Collections
                </h1>
                <div className="bg-white w-full h-[60vh]  mt-2 rounded-xl">
                  <Carousel
                    infiniteLoop={true}
                    interval={1200}
                    autoPlay={true}
                    showIndicators={false}
                    showStatus={false}
                    showThumbs={false}
                    autoFocus={true}
                    className="rounded-xl cursor-pointer h-[40vh]"
                  >
                    {products?.map((item) => (
                      <div
                        onClick={() =>
                          setValues([
                            item.title,
                            item.image,
                            item.price,
                            item.description,
                            item.model,
                          ])
                        }
                        key={item?.id}
                        className="h-[56vh] overflow-hidden"
                      >
                        <div className="w-full h-full object-contain rounded-xl overflow-hidden">
                          <img
                            src={item?.image}
                            alt={item.title}
                            className="w-full cursor-pointer h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </Carousel>
                </div>
              </div>

              <div className="w-full h-full">
                <h1 className="p-5 font-semibold text-[23px] text-gray-600">
                  Our Products
                </h1>
                <div className="flex flex-row flex-wrap gap-5 items-center justify-center border-black w-full h-full">
                  {allProducts.map((items) => {
                    return (
                      <div
                        key={items.id}
                        className="cursor-pointer w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
                        onClick={() =>
                          setValues([
                            items.title,
                            items.image,
                            items.price,
                            items.description,
                            items.model,
                          ])
                        }
                      >
                        <img
                          src={items.image}
                          alt="Product"
                          className="h-65 w-72 object-cover rounded-t-xl"
                        />
                        <div className="px-4 py-3 w-72">
                          <span className="text-gray-400 mr-3 uppercase text-xs">
                            {items.brand}
                          </span>
                          <p className="text-lg font-bold text-gray-600 truncate block capitalize">
                            {items.title}
                          </p>
                          <div className="flex items-center">
                            <p className="text-lg font-semibold text-gray-600 cursor-auto my-3">
                              ${items.price}
                            </p>
                            <del>
                              <p className="text-sm text-gray-600 cursor-auto ml-2">
                                $
                                {items.discount
                                  ? items.price + items.discount
                                  : items.price + items.price}
                              </p>
                            </del>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {showProductCard && (
            <ProductCard
              proTitle={title}
              proImg={image}
              proPrice={price}
              proDesc={description}
              proModel={model}
            />
          )}
        </>
      )}
    </>
  );
};

export default Home;
