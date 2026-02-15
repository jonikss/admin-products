export interface Product {
  id: number;
  title: string;
  brand: string;
  sku: string;
  rating: number;
  price: number;
  category: string;
  thumbnail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}

export async function fetchProducts({
  limit = 10,
  skip = 0,
  sortBy,
  order,
  search,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
    select: "id,title,brand,sku,rating,price,category,thumbnail",
  });

  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order ?? "asc");
  }

  const base = search
    ? `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&${params}`
    : `https://dummyjson.com/products?${params}`;

  const res = await fetch(base);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  return res.json();
}
