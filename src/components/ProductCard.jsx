// import React from "react";
// import { Link } from "react-router-dom";

// const ProductCard = ({ product, latest }) => {
//     if (!product) return null;

//     const imageUrl = product.images?.[0]?.url;
//     const formattedPrice = Number(product.price || 0).toLocaleString("en-IN");

//     return (
//         <article className="group h-full">
//             <Link to={`/product/${product._id}`} className="block h-full">
//                 <div className="h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
//                     <div className="relative aspect-square w-full overflow-hidden bg-muted/40 p-3 sm:p-4">
//                         {latest === "yes" ? (
//                             <span className="absolute left-3 top-3 z-10 rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:text-xs">
//                                 Latest
//                             </span>
//                         ) : null}

//                         {imageUrl ? (
//                             <img
//                                 src={imageUrl}
//                                 alt={product.title || "Product"}
//                                 className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
//                             />
//                         ) : (
//                             <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground sm:text-sm">
//                                 No Image
//                             </div>
//                         )}
//                     </div>

//                     <div className="space-y-2 p-3 sm:p-4">
//                         <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
//                             {product.title}
//                         </h3>
//                         <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
//                             {product.about}
//                         </p>

//                         <div className="flex items-center justify-between pt-1">
//                             <p className="text-base font-bold sm:text-lg">₹{formattedPrice}</p>
//                             <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground sm:text-xs">
//                                 {product.category}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </Link>
//         </article>
//     );
// };

// export default ProductCard;




import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const ProductCard = ({ product, latest }) => {
    if (!product) return null;

    const imageUrl = product.images?.[0]?.url;

    return (
        <article className="group h-full">
            <div className="h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-blue-600 hover:border-2">
                <div className="relative aspect-square w-full overflow-hidden bg-muted/40 p-3 sm:p-4">
                    {latest === "yes" ? (
                        <Badge className="absolute left-3 top-3 z-10 bg-green-500 text-white">New</Badge>
                    ) : null}

                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.title || "Product"}
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>

                <div className="space-y-3 p-3 sm:p-4">
                    {/* <h3 className="line-clamp-2 text-sm font-semibold sm:text-base"> */}
                                        <h3 className="line-clamp-1 text-sm font-semibold sm:text-base">

                        {product.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                        {product.about}
                    </p>
                    <p className="text-base font-bold sm:text-lg">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>

                    <Button asChild className="w-[50%] text-center hover:bg-blue-600 bg-blue-500 text-white">
                        <Link to={`/product/${product._id}`}>View Product</Link>
                    </Button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
