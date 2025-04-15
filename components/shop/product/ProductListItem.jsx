"use client"

const ProductListItem = ({
    productName,
    productDescription,
    seller,
    price,
    discount,
    quantity,
    onQuantityChange,
    onSaveForLater,
    onRemove,
    className,
  }) => {
    return (
      <div className={`border p-4 ${className}`}>
        {/* <img src="path/to/image" alt={productName} className="w-full h-32 object-cover mb-2" /> */}
        <h2 className="text-lg font-bold">{productName}</h2>
        <p className="text-sm text-gray-600">{productDescription}</p>
        <p className="text-sm text-gray-500">Seller: {seller}</p>
        <p className="text-lg font-semibold">₹{price} <span className="text-green-500">({discount} Off)</span></p>
        <div className="flex items-center mt-2">
          <button onClick={() => onQuantityChange(-1)} className="px-2 py-1 border">-</button>
          <span className="mx-2">{quantity}</span>
          <button onClick={() => onQuantityChange(1)} className="px-2 py-1 border">+</button>
        </div>
        <div className="flex flex-col mt-2">
          <button onClick={onSaveForLater} className="text-blue-500">SAVE FOR LATER</button>
          <button onClick={onRemove} className="text-red-500">REMOVE</button>
        </div>
      </div>
    );
  };
  
  export default ProductListItem;