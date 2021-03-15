import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from 'antd';
import Numeral from 'numeral';

function ProductsList({ products }) {
  const Ul = styled.ul`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  `;
  const Li = styled.li`
    position: relative;
    width: 300px;
    margin: 0 5px 60px;
    cursor: pointer;
  `;
  const Name = styled.p`
    margin-top: 0.75rem;
    font-size: 1.075rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.65);
  `;
  const Price = styled.p`
    margin-top: -0.5rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.65);
  `;
  const Text = styled.p`
    margin-top: -0.5rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.65);
  `;
  const Discount = styled.div`
    .rate {
      font-size: 1rem;
      color: #fa5252;
      font-weight: bold;
    }
    .discount {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.65);
    }
    .price {
      display: block;
      margin-top: 0.15rem;
      color: #868e96;
      text-decoration: line-through;
    }
  `;
  const Likes = styled.div`
    margin-top: 2rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.65);
  `;

  return (
    <Ul>
      {products.map((product) => (
        <Li key={product.id}>
          <Link to={`/product/${product.id}`}>
            {product.image && (
              <img
                src={product.image}
                style={{ width: '300px', height: '370px', objectFit: 'cover' }}
                alt="img"
              />
            )}
            {product.name && <Name>{product.name}</Name>}
            {product.price && !product.discountRate && (
              <Price>{Numeral(product.price).format(0, 0)}원</Price>
            )}
            {product.text && <Text>{product.text}</Text>}
            {product.discountRate && (
              <Discount>
                <span className="rate">{product.discountRate}% </span>
                <span className="discount">
                  {Numeral(
                    product.price * (1 - product.discountRate * 0.01),
                  ).format(0, 0)}
                  원
                </span>
                <span className="price">
                  {Numeral(product.price).format(0, 0)}원
                </span>
              </Discount>
            )}
            {product.likes && (
              <Likes>
                <span style={{ marginRight: '1rem' }}>
                  <Icon type="heart" /> {product.likes}
                </span>
                <span>
                  <Icon type="message" /> {product.reviews}
                </span>
              </Likes>
            )}
          </Link>
        </Li>
      ))}
    </Ul>
  );
}

export default ProductsList;
