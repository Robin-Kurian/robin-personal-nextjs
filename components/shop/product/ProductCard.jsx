import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Image } from "@heroui/react";
import CONSTANTS from "@/utilities/constants";
import useProductStore from "@/hooks/useProductStore";
import { useRef } from 'react';

const ProductCard = ({ product, index }) => {
  const setProductDetails = useProductStore((state) => state.setProductDetails);
  const router = useRouter();
  const cardRef = useRef(null);

  const handleProductClick = (event) => {
      setProductDetails(product);
      router.push(`/products/${product?.id}`);
    
  };

  return (
    <Card
      ref={cardRef}
      key={index}
      className="rounded-2xl p-3"
      isPressable
      onPress={handleProductClick}
    >
      <CardBody className="overflow-visible p-0">
        <div className="relative">
          <Image
            isZoomed
            isBlurred
            width={270}
            height={200}
            alt={product?.name}
            src={product?.imageURL}
            className={`object-cover rounded ${!product?.isActive ? 'opacity-50' : ''}`}
          />
          {!product?.isActive && (
            <div className="z-10 absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg font-medium">
                Out of Stock
              </div>
            </div>
          )}
        </div>
        <CardHeader className="p-0 pt-2 pl-1 flex-col items-start">
          <h4 className="font-normal text-lg">{product?.name}</h4>
          <h2 className="text-md uppercase font-medium">
            {product?.price ? (
              <span >
                {CONSTANTS.SYMBOLS.CURRENCY}
                {product?.price.toFixed(2)}
              </span>
            ) : (
              CONSTANTS.PLACEHOLDER.CURRENCY
            )}
          </h2>
        </CardHeader>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
