import { ThreeDots } from 'react-loader-spinner'
import { useState, useEffect, useCallback } from 'react'
import Header from '../Header'
import { Link, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import SimilarProductItem from '../SimilarProductItem'
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs'
import './index.css'

const ProductItemDetails = () => {
  const { id } = useParams()

  const [productItemList, setProductItemList] = useState({
    similarProducts: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [count, setCount] = useState(1)

  // ✅ FIXED: useCallback added
  const getEachListItem = useCallback(async () => {
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        similarProducts: fetchedData.similar_products.map(product => ({
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          imageUrl: product.image_url,
          rating: product.rating,
          totalReviews: product.total_reviews,
          availability: product.availability,
          description: product.description,
        })),
      }

      setProductItemList(updatedData)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      setIsError(true)
    }
  }, [id]) // ✅ dependency added

  // ✅ FIXED: dependency updated
  useEffect(() => {
    getEachListItem()
  }, [getEachListItem])

  const decreaseClicked = () => {
    setCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1))
  }

  const increaseClicked = () => {
    setCount(prevCount => prevCount + 1)
  }

  if (isLoading) {
    return (
      <div data-testid="loader">
        <ThreeDots color="#0b69ff" height="50" width="50" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="eror-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="failed-image"
        />
        <h1>Product Not Found</h1>
        <Link to="/products">
          <button type="button">Continue Shopping</button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Header />

      <div className="total-productslist-container">
        <div className="each-item-container">
          <img
            src={productItemList.imageUrl}
            alt="product"
            className="each-item"
          />

          <div className="sec-container-details">
            <h1>{productItemList.title}</h1>
            <p>Rs {productItemList.price}/-</p>

            <p>{productItemList.rating}</p>
            <p>{productItemList.totalReviews} Reviews</p>
            <p>{productItemList.description}</p>
            <p>Available: {productItemList.availability}</p>
            <p>Brand: {productItemList.brand}</p>

            <hr />

            <div className="increase-and-decrese-btns">
              <button
                type="button"
                className="all-buttons"
                data-testid="minus"
                onClick={decreaseClicked}
              >
                <BsDashSquare />
              </button>

              <p>{count}</p>

              <button
                type="button"
                className="all-buttons"
                data-testid="plus"
                onClick={increaseClicked}
              >
                <BsPlusSquare />
              </button>
            </div>

            <button type="button">ADD TO CART</button>
          </div>
        </div>

        <div className="productitems-container">
          <h1>Similar Products</h1>
          <ul className="unordered-products-container">
            {productItemList.similarProducts.map(product => (
              <SimilarProductItem
                key={product.id}
                productDetails={product}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ProductItemDetails
