import React from "react";
import ProductCard from "./productcard";
import { Product } from "@/types";

interface ProductListProps {
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      <div className="grid grip-cols-1 sm:grid-col-cols-2 md:grid-cols-3 
                      lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;