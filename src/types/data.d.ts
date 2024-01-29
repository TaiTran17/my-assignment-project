interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
  description: string;
  discountPercentage: number;
  images: string[];
  rating: number;
  stock: number;
  thumbnail: string;
}
interface ApiResponse {
  products: Product[];
  // Other properties from the API response
}
