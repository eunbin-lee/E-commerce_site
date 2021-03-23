import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadProduct, deleteProduct } from "../../../_actions/product_actions";
import { Link } from "react-router-dom";
import Numeral from "numeral";
import styled from "styled-components";
import { Button, Checkbox, Select, Icon, Modal } from "antd";
import RecommendProduct from "./Sections/RecommendProduct";
const { Option } = Select;

const AdminPage = () => {
  const dispatch = useDispatch();
  const [productStore, setProductStore] = useState();
  const [products, setProducts] = useState();
  if (!products) {
    dispatch(loadProduct("all"))
      .then((response) => {
        if (response.payload.success) {
          setProducts(response.payload.product);
          setProductStore(response.payload.product);
        } else {
          console.log(response.payload);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  const Table = styled.div`
    display: flex;
    align-items: center;
    padding: 20px 0;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
    letter-spacing: -1px;
  `;
  const TableRow = styled.div`
    display: flex;
    align-items: center;
    padding: 15px 0;
    font-size: 0.9rem;
    letter-spacing: -1px;
    border-top: 1px solid #adb5bd;
    p {
      margin: 0;
      padding: 0;
    }
  `;

  // 상품 카테고리
  const [category, setCategory] = useState("all");
  const onChangeCategory = (value) => {
    setCategory(value);
    if (value === "all") {
      return setProducts(productStore);
    }
    if (value === "best") {
      return setProducts(
        productStore.filter((product) => product.bestProduct === true)
      );
    }
    if (value === "new") {
      return setProducts(
        productStore.filter((product) => product.newProduct === true)
      );
    }
    if (value === "discount") {
      return setProducts(productStore.filter((product) => product.rate > 0));
    }
  };

  //상품 선택
  const [checked, setChecked] = useState(false);
  const [checkedID, setCheckedID] = useState([]);
  const onCheckAll = () => {
    setChecked(!checked);
    if (products) {
      setProducts(
        products.map((product) => ({ ...product, checked: !checked }))
      );
      if (!checked) {
        setCheckedID(products.map((product) => product.id));
      } else {
        setCheckedID([]);
      }
    }
  };
  const onCheckProduct = (id) => {
    if (products) {
      setProducts(
        products.map((product) =>
          product.id === id
            ? { ...product, checked: !product.checked }
            : product
        )
      );
      let index = products.findIndex((product) => product.id === id);
      if (!products[index].checked) {
        setCheckedID((checkedID) => checkedID.concat(id));
      } else {
        checkedID.splice(checkedID.indexOf(id), 1);
      }
    }
  };

  //상품 삭제
  const onRemove = (id) => {
    if (products) {
      setProducts(products.filter((product) => product.id !== id));
      dispatch(deleteProduct(id))
        .then((response) => {
          if (response.payload.success) {
            alert("해당 상품이 삭제되었습니다.");
          } else {
            console.log(response.payload);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  const onRemoveSelect = async () => {
    if (products) {
      setProducts(
        products.filter((product) => !checkedID.includes(product.id))
      );
      checkedID.map((id) =>
        dispatch(deleteProduct(id))
          .then((response) => {
            if (response.payload.success) {
            } else {
              console.log(response.payload);
            }
          })
          .catch((err) => {
            alert(err);
          })
      )
    }
  };

  //추천 상품 모달
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <h2 style={{ fontWeight: "bold" }}>판매자 상품 관리</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem 0",
        }}
      >
        <Select
          style={{ width: "150px" }}
          defaultValue="all"
          value={category}
          onChange={onChangeCategory}
        >
          <Option value="all">All</Option>
          <Option value="best">Best</Option>
          <Option value="new">New</Option>
          <Option value="discount">Discount</Option>
        </Select>
      </div>

      <div
        style={{
          borderTop: "3px solid #343a40",
          borderBottom: "1px solid #343a40",
        }}
      >
        <Table>
          <Checkbox
            style={{ width: "6%" }}
            onClick={onCheckAll}
            checked={checked}
          />
          <div style={{ width: "31.5%" }}>상품 정보</div>
          <div style={{ width: "12.5%" }}>카테고리</div>
          <div style={{ width: "12.5%" }}>재고수량</div>
          <div style={{ width: "12.5%" }}>판매금액</div>
          <div style={{ width: "12.5%" }}>배송구분</div>
          <div style={{ width: "12.5%" }}>선택</div>
        </Table>
        {products &&
          products.map((product) => (
            <div key={product.id}>
              <TableRow>
                {/* 체크박스 */}
                <Checkbox
                  style={{ width: "6%", textAlign: "center" }}
                  checked={product.checked}
                  onClick={() => onCheckProduct(product.id)}
                />

                {/* 상품 정보 */}
                <Link to={`/product/${product.id}`} style={{ width: "31.5%" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={product.mainImg}
                      width="100px"
                      height="100px"
                      alt="img"
                    />
                    <div style={{ marginLeft: "15px" }}>
                      {product.recoProduct ? (
                        <p style={{ fontSize: "0.75rem", color: "#3e91f7" }}>
                          <Icon type="like" />
                          <span> 추천 상품</span>
                        </p>
                      ) : null}
                      <p style={{ fontWeight: "bold", color: "#555" }}>
                        {product.productName}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* 카테고리 */}
                <div
                  style={{
                    width: "12.5%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <p>
                    {product.bestProduct
                      ? "Best"
                      : product.newProduct
                      ? "New"
                      : "기본"}
                  </p>
                </div>

                {/* 재고 수량 */}
                <div style={{ width: "12.5%", textAlign: "center" }}>
                  <p>{Numeral(product.stock).format(0, 0)}개</p>
                </div>

                {/* 판매금액 */}
                <div style={{ width: "12.5%", textAlign: "center" }}>
                  {product.rate > 0 ? (
                    <>
                      <p>
                        <span style={{ color: "#fa5252", fontWeight: "bold" }}>
                          {product.rate}%{" "}
                        </span>
                        {Numeral(
                          product.price * (1 - product.discountRate * 0.01)
                        ).format(0, 0)}
                        원
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#868e96",
                          textDecoration: "line-through",
                        }}
                      >
                        {Numeral(product.price).format(0, 0)}원
                      </p>
                    </>
                  ) : (
                    <p>{Numeral(product.price).format(0, 0)}원</p>
                  )}
                </div>

                {/* 배송구분 */}
                <div style={{ width: "12.5%", textAlign: "center" }}>
                  <p>기본배송</p>
                </div>

                {/* 선택 */}
                <div style={{ width: "12.5%", textAlign: "center" }}>
                  <p style={{ margin: "2.5px 0" }}>
                    <Button style={{ fontSize: "0.75rem" }}>
                      <Link to={`/admin/update/${product.id}`}>수정</Link>
                    </Button>
                  </p>
                  <p style={{ margin: "2.5px 0" }}>
                    <Button
                      type="primary"
                      style={{ fontSize: "0.75rem" }}
                      onClick={() => onRemove(product.id)}
                    >
                      삭제
                    </Button>
                  </p>
                </div>
              </TableRow>
            </div>
          ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px 0",
        }}
      >
        <div>
          <Button>
            <Link to="/admin/upload">상품 등록</Link>
          </Button>
          <Button style={{ marginLeft: "5px" }} onClick={showModal}>
            추천상품 관리
          </Button>
          <Modal
            title="추천상품"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="완료"
            cancelText="취소"
          >
            <RecommendProduct products={products} />
          </Modal>
        </div>
        <Button
          type="primary"
          style={{ marginLeft: "5px" }}
          onClick={() => onRemoveSelect()}
        >
          선택상품 삭제
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
