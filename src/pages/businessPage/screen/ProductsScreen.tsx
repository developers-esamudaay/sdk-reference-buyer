import React, { useEffect, useState } from "react";
import { Product } from "interfaces/ResponseInterfaces";
import { getProducts } from "data/firbaseCalls";
import { QueryTypes } from "constants/queryTypes";
import ProductCard from "pages/ProductListing/Components/ProductCard";
import styles from "styles/businessProfile/BusinessPage.module.scss";
type ProductScreenMaps = {
  id: string;
  business_name: string;
};
const ProductScreen: React.FC<ProductScreenMaps> = ({ id, business_name }) => {
  console.log(id);
  const [products, setProducts] = useState<Product[] | []>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);

      const products: Product[] = await getProducts({
        queryParam: id,

        queryType: QueryTypes.PROVIDER_FILTER_QUERY,
      });
      console.log(products);
      setProducts(products);
      setLoading(false);
    })();
  }, [id]);
  console.log(products);
  return (
    <div className={styles.product_screen_wrapper}>
      <div className={styles.product_screen_header_text}>
        <p>
          {`${products.length} products from `}
          <span style={{ color: "blue" }}>{business_name}</span>
        </p>
      </div>
      <div className="container">
        <div className={`row pe-2`}>
          {products.map((product) => {
            return (
              <div
                key={product?.unique_id ?? ""}
                className="col-xl-3 col-lg-6 col-md-6 col-sm-6 col-6 p-2"
              >
                <ProductCard product={product} fromScreen={"business"} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default React.memo(ProductScreen);
