import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, price, imageUrl, rating} = productDetails
  return (
    <li className="min-list-container1">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="remaining-products-img"
      />
      <div>
        <h1 className="min-title">{title}</h1>
        <p>{brand}</p>
        <p>RS {price}</p>
        <button>{rating}</button>
      </div>
    </li>
  )
}

export default SimilarProductItem
