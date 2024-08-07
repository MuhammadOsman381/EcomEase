import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showProductCard, setShowProductCard] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(true);

 
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
    getAllproducts();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col mt-14 gap-5 items-center justify-center w-full h-full">
          {showProductCard ? (
            <ProductCard
              proTitle={title}
              proImg={image}
              proPrice={price}
              proDesc={description}
              proModel={model}
            />
          ) : (
            <div className="w-full h-full">
              <h1 className="p-5 font-bold text-[23px] text-gray-600">
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
          )}
        </div>
      )}
    </>
  );
};

export default Products;
