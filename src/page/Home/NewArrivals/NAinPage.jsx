
/*
giả sử fetch api trả về 1 list sản phẩm (Product) được gắn nhẵn là 
NewArrivals như sau:
*/
const response = [
  {
    id: 1,
    category: "ABC",
    title: "Sản phẩm 1",
    price: 100000,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
    description: "Description 1",
    rate: 3.5,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    list_product_variation: [
      {
        id_variation: 1,
        product_id: 1,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      },
      {
        id_variation: 2,
        product_id: 1,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      }
    ],
    Discount: 0

  },
  {
    id: 2,
    category: "ABC",
    title: "Sản phẩm 2",
    price: 134000,
    thumbnail: "https://lh3.googleusercontent.com/8yeWX5QuojHYCVsAURA-JeADXEVT4_wR9XETeqx7-KRGHp-MpY_z6dN3LWjmDRQcE8JJktnK-T5eMtwDVvsZ7cnHWXeCLQzRgIk6I6rkfzeadq_7rdiFxxSi8dgrRNesUzJaN-sP9B-l7CJfcr6d_mdPvtGWAMXn33rcWe3ycjnOMZrz52WO1ihQ_9WeV-3kCb6BJYyKeNIrfJeowr35hchtjnIP03Qz4sPZp9Hr-2rNpk04cr-BkvbQPhutgRpGLw-pmLBkrNY8DrkPspksOeXept3vfArWfCGMQuPc6PDLOGfx8jwUWz6ay5ldzufsu0dk1inlmx_HkXacWInK8R1grl0I-xQqHnpWgRNK-mE-gkDL92Z6dj1-4ljNym03GFz3UnQF6NL_U-XosRxHnTyOqhgGjmHhDBXb2VMuufngSnVHdp57JqPGSVgDOShCj2eKz4TBx52x8TkSJWY9Uc3dy6wRrdY6I0fAJZQpPYoQSIQbGMbLeWzHeHu71ykxAudnJVTLeeAZLN8Y5oJCHHfTOGJlwA_nM5gE5NMSX9UbFICqsb7xLX_9O173prqbQNIhKFbbh8BoOy_9sSzQeWRdg5ZObxmR7spcKch85ywXykcwuvBnBUWWaMOjrYU6WTVTLB5VUz8-GIpiRZquoY03ZIq7mcxtzicR92o8m4nzNV0dkp_oOqhZoHTxAc6A8Uf5vFscEEVvjzcfrO5h1rT8=w1606-h903-no",
    description: "Description 2",
    rate: 3.5,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    list_product_variation: [
      {
        id_variation: 3,
        product_id: 2,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      },
      {
        id_variation: 4,
        product_id: 2,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      }
    ],
    Discount: 10
  },
  {
    id: 3,
    category: "ABC",
    title: "Sản phẩm 3",
    price: 120000,
    thumbnail: "https://lh3.googleusercontent.com/8yeWX5QuojHYCVsAURA-JeADXEVT4_wR9XETeqx7-KRGHp-MpY_z6dN3LWjmDRQcE8JJktnK-T5eMtwDVvsZ7cnHWXeCLQzRgIk6I6rkfzeadq_7rdiFxxSi8dgrRNesUzJaN-sP9B-l7CJfcr6d_mdPvtGWAMXn33rcWe3ycjnOMZrz52WO1ihQ_9WeV-3kCb6BJYyKeNIrfJeowr35hchtjnIP03Qz4sPZp9Hr-2rNpk04cr-BkvbQPhutgRpGLw-pmLBkrNY8DrkPspksOeXept3vfArWfCGMQuPc6PDLOGfx8jwUWz6ay5ldzufsu0dk1inlmx_HkXacWInK8R1grl0I-xQqHnpWgRNK-mE-gkDL92Z6dj1-4ljNym03GFz3UnQF6NL_U-XosRxHnTyOqhgGjmHhDBXb2VMuufngSnVHdp57JqPGSVgDOShCj2eKz4TBx52x8TkSJWY9Uc3dy6wRrdY6I0fAJZQpPYoQSIQbGMbLeWzHeHu71ykxAudnJVTLeeAZLN8Y5oJCHHfTOGJlwA_nM5gE5NMSX9UbFICqsb7xLX_9O173prqbQNIhKFbbh8BoOy_9sSzQeWRdg5ZObxmR7spcKch85ywXykcwuvBnBUWWaMOjrYU6WTVTLB5VUz8-GIpiRZquoY03ZIq7mcxtzicR92o8m4nzNV0dkp_oOqhZoHTxAc6A8Uf5vFscEEVvjzcfrO5h1rT8=w1606-h903-no",
    description: "Description 3",
    rate: 2.5,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    list_product_variation: [
      {
        id_variation: 5,
        product_id: 3,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      }
    ],
    Discount: 0
  },
  {
    id: 4,
    category: "ABC",
    title: "Sản phẩm 4",
    price: 540000,
    thumbnail: "https://lh3.googleusercontent.com/8yeWX5QuojHYCVsAURA-JeADXEVT4_wR9XETeqx7-KRGHp-MpY_z6dN3LWjmDRQcE8JJktnK-T5eMtwDVvsZ7cnHWXeCLQzRgIk6I6rkfzeadq_7rdiFxxSi8dgrRNesUzJaN-sP9B-l7CJfcr6d_mdPvtGWAMXn33rcWe3ycjnOMZrz52WO1ihQ_9WeV-3kCb6BJYyKeNIrfJeowr35hchtjnIP03Qz4sPZp9Hr-2rNpk04cr-BkvbQPhutgRpGLw-pmLBkrNY8DrkPspksOeXept3vfArWfCGMQuPc6PDLOGfx8jwUWz6ay5ldzufsu0dk1inlmx_HkXacWInK8R1grl0I-xQqHnpWgRNK-mE-gkDL92Z6dj1-4ljNym03GFz3UnQF6NL_U-XosRxHnTyOqhgGjmHhDBXb2VMuufngSnVHdp57JqPGSVgDOShCj2eKz4TBx52x8TkSJWY9Uc3dy6wRrdY6I0fAJZQpPYoQSIQbGMbLeWzHeHu71ykxAudnJVTLeeAZLN8Y5oJCHHfTOGJlwA_nM5gE5NMSX9UbFICqsb7xLX_9O173prqbQNIhKFbbh8BoOy_9sSzQeWRdg5ZObxmR7spcKch85ywXykcwuvBnBUWWaMOjrYU6WTVTLB5VUz8-GIpiRZquoY03ZIq7mcxtzicR92o8m4nzNV0dkp_oOqhZoHTxAc6A8Uf5vFscEEVvjzcfrO5h1rT8=w1606-h903-no",
    description: "Description 4",
    rate: 4.5,
    createdAt: "2025-01-01",
    updatedAt: "2025-01-01",
    list_product_variation: [
      {
        id_variation: 6,
        product_id: 4,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      },
      {
        id_variation: 7,
        product_id: 4,
        thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvjbXv4gspAYEA6p-yih_uGs7WDPMjolxBTQ&s",
      }
    ],
    Discount: 0
  }
];

export default function NAinPage() {
  return (
    <div>
      {response.map((product) => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
  // for 1 trong 4 prod, mỗi prod thì render ra một ProductCard (viết ProductCard.jsx ở Components)
}