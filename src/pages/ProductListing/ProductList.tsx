import React, { useState, useEffect } from "react";
import ProductCard from "./Components/ProductCard";
import styles from "../../styles/products/productList.module.scss";
import Loading from "../../sharedComponents/loading/Loading";
import no_product_found from "../../assets/images/no_product_found.jpeg";
import { QueryTypes } from "../../constants/queryTypes";
import { isEmptyObject } from "../../commonUtils";
import { Product } from "../../interfaces/ResponseInterfaces";
import Pagination from "../../sharedComponents/pagination/Pagination";
import {
  getProducts,
  addProducts,
  getAllBusiness,
  addKeys,
  addUpdatedBusiness,
} from "../../data/firbaseCalls";
const EmptyProductView = (
  <div className={styles.empty_product_view}>
    <img src={"../../assets/images/empty_box.png"} width="150" height="150" />
  </div>
);
const ProductList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[] | []>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [prevPage, setPrevPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<number>(2);
  const [lastProductId, setLastProductId] = useState<string>("");
  const [firstProductId, setFirstProductId] = useState<string>("");
  useEffect(() => {
    console.log(prevPage, currentPage, nextPage);
    if (currentPage > nextPage || currentPage < prevPage) {
      currentPage === 1 ? setPrevPage(1) : setPrevPage(currentPage - 1);
      setNextPage(currentPage + 1);
    }
  }, [currentPage]);
  async function fetchProducts(query_type: QueryTypes, queryParam: string) {
    console.log(query_type, queryParam);
    setLoading(true);

    setProducts([]);
    const allProducts: Product[] =
      (await getProducts({
        queryType: query_type,
        queryParam: queryParam,
        offset: 24,
      })) ?? [];
    console.log(allProducts);
    setFirstProductId(
      Array.isArray(allProducts) && allProducts.length > 0
        ? allProducts[0]?.item_id
        : ""
    );
    setLastProductId(
      Array.isArray(allProducts) && allProducts.length > 0
        ? allProducts[allProducts.length - 1]?.item_id
        : ""
    );

    setProducts(allProducts);
    setLoading(false);
  }
  //fetch products on first call
  useEffect(() => {
    (async () => {
      await fetchProducts(QueryTypes.NO_QUERY, "");
    })();
  }, []);
  return (
    <div className={styles.product_list_container}>
      {loading ? <Loading/> : ( <div className="container" style={{ borderBottom: "1px solid gray" }}>
        {products.length === 0 && (
          <div className={styles.empty_product_view}>
            <img src={no_product_found} width={"300px"} height={"300px"} />
          </div>
        )}
        <div className={`row pe-2`}>
          {products.map((product) => {
            return (
              <div
                key={product?.item_id}
                className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6 p-2"
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
        {/* products cards */}

        {/* pagination for prev and next page */}
      </div>)}

     

      {products.length === 24 && (
        <div className={styles.pagination}>
          <Pagination
            prevPage={prevPage}
            nextPage={nextPage}
            currentPage={currentPage}
            offset={24}
            onNext={async () => {
              setCurrentPage((prev) => prev + 1);
              await fetchProducts(QueryTypes.NEXT_PAGE_QUERY, lastProductId);
            }}
            onPrevious={async () => {
              setCurrentPage((prev) => prev - 1);
              await fetchProducts(QueryTypes.PREV_PAGE_QUERY, firstProductId);
            }}
          />
        </div>
      )}
    </div>
  );
};
export default ProductList;
